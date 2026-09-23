import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

function verificaToken(request) {
  const auth = request.headers.get('Authorization') || ''
  const token = auth.replace('Bearer ', '')
  return token === process.env.ADMIN_SESSION_TOKEN
}

// Lista completa (tutte le versioni, anche non attive) per il cruscotto
export async function GET(request) {
  if (!verificaToken(request)) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('allegati_voucher')
    .select('*')
    .order('codice', { ascending: true })
    .order('versione', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

// Upload: multipart/form-data con file + metadata JSON
export async function POST(request) {
  if (!verificaToken(request)) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file')
  const codice = formData.get('codice')
  const titolo = formData.get('titolo')
  const descrizione = formData.get('descrizione') || null
  const verificato_da = formData.get('verificato_da') || null
  const note = formData.get('note') || null
  const rendi_attivo = formData.get('rendi_attivo') !== 'false'

  if (!file || !codice || !titolo) {
    return NextResponse.json({ error: 'Campi mancanti: file, codice o titolo' }, { status: 400 })
  }

  const supabase = getSupabase()

  // Calcola la prossima versione per questo codice
  const { data: versioni } = await supabase
    .from('allegati_voucher')
    .select('versione')
    .eq('codice', codice)
    .order('versione', { ascending: false })
    .limit(1)
  const prossimaVersione = versioni?.[0] ? versioni[0].versione + 1 : 1

  // Upload su Storage
  const estensione = file.name.split('.').pop()
  const path = `${codice.replace(/\./g, '_')}/v${prossimaVersione}_${Date.now()}.${estensione}`
  const buffer = Buffer.from(await file.arrayBuffer())
  const { error: uploadError } = await supabase.storage
    .from('allegati_voucher')
    .upload(path, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: urlData } = supabase.storage.from('allegati_voucher').getPublicUrl(path)

  // Se la nuova versione va resa attiva, disattiva le precedenti dello stesso codice
  if (rendi_attivo) {
    await supabase.from('allegati_voucher').update({ attivo: false }).eq('codice', codice)
  }

  const { data, error } = await supabase
    .from('allegati_voucher')
    .insert({
      codice, titolo, descrizione, verificato_da, note,
      versione: prossimaVersione,
      file_url: urlData.publicUrl,
      file_nome: file.name,
      file_dimensione: file.size,
      attivo: rendi_attivo,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// Aggiorna metadata o toggle attivo
export async function PATCH(request) {
  if (!verificaToken(request)) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const body = await request.json()
  const { id, ...updates } = body
  if (!id) return NextResponse.json({ error: 'ID mancante' }, { status: 400 })

  const supabase = getSupabase()

  // Se sto attivando questa versione, disattivo tutte le altre con lo stesso codice
  if (updates.attivo === true) {
    const { data: esistente } = await supabase.from('allegati_voucher').select('codice').eq('id', id).single()
    if (esistente?.codice) {
      await supabase.from('allegati_voucher').update({ attivo: false }).eq('codice', esistente.codice)
    }
  }

  const { error } = await supabase.from('allegati_voucher').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// Elimina una versione (file da storage + record)
export async function DELETE(request) {
  if (!verificaToken(request)) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID mancante' }, { status: 400 })

  const supabase = getSupabase()

  // Recupera il file_url per estrarre il path e cancellarlo dallo storage
  const { data: record } = await supabase.from('allegati_voucher').select('file_url').eq('id', id).single()
  if (record?.file_url) {
    const marker = '/allegati_voucher/'
    const idx = record.file_url.indexOf(marker)
    if (idx !== -1) {
      const path = record.file_url.substring(idx + marker.length)
      await supabase.storage.from('allegati_voucher').remove([path])
    }
  }

  const { error } = await supabase.from('allegati_voucher').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
