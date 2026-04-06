import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const DESTINATARI = [
  'michele.borzatta@startingwork.it'
]

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const oggi = new Date()
  oggi.setHours(0, 0, 0, 0)
  const domani = new Date(oggi)
  domani.setDate(domani.getDate() + 1)

  const { data: iscrizioni, error } = await supabase
    .from('iscrizioni')
    .select('corsi_interesse, sedi_preferite, idoneo_gol, stato, created_at')
    .gte('created_at', oggi.toISOString())
    .lt('created_at', domani.toISOString())

  if (error) return new Response('DB Error', { status: 500 })
  if (!iscrizioni || iscrizioni.length === 0) {
    return new Response('Nessuna iscrizione oggi', { status: 200 })
  }

  const perCorso = {}
  for (const i of iscrizioni) {
    const corsi = Array.isArray(i.corsi_interesse) ? i.corsi_interesse : [i.corsi_interesse]
    const sedi = Array.isArray(i.sedi_preferite) ? i.sedi_preferite : [i.sedi_preferite]
    for (const corso of corsi) {
      if (!perCorso[corso]) perCorso[corso] = { como: { idonei: 0, nonIdonei: 0 }, tremezzina: { idonei: 0, nonIdonei: 0 }, online: { idonei: 0, nonIdonei: 0 }, totale: 0 }
      for (const sede of sedi) {
        if (perCorso[corso][sede]) {
          if (i.idoneo_gol) perCorso[corso][sede].idonei++
          else perCorso[corso][sede].nonIdonei++
        }
      }
      perCorso[corso].totale++
    }
  }

  const dataOggi = oggi.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const righeCorsi = Object.entries(perCorso).map(([corso, dati]) => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#1a2e5a;text-transform:capitalize">${corso.replace(/-/g, ' ')}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;text-align:center">${dati.como.idonei + dati.como.nonIdonei}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;text-align:center">${dati.tremezzina.idonei + dati.tremezzina.nonIdonei}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;text-align:center;color:#2d7a4f;font-weight:600">${dati.como.idonei + dati.tremezzina.idonei + dati.online.idonei}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;text-align:center;color:#c96a00;font-weight:600">${dati.como.nonIdonei + dati.tremezzina.nonIdonei + dati.online.nonIdonei}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:700;color:#1a2e5a">${dati.totale}</td>
    </tr>
  `).join('')

  const html = `
<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:680px;margin:0 auto;padding:32px 16px">
    
    <div style="background:#1a2e5a;border-radius:16px 16px 0 0;padding:32px;text-align:center">
      <div style="display:inline-block;background:#c8941a;border-radius:50%;width:48px;height:48px;line-height:48px;text-align:center;font-weight:900;color:white;font-size:18px;margin-bottom:16px">FC</div>
      <h1 style="margin:0;color:white;font-size:22px;font-weight:700">Report Iscrizioni</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;text-transform:capitalize">${dataOggi}</p>
    </div>

    <div style="background:white;padding:32px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0">
      <div style="display:flex;gap:16px;margin-bottom:32px">
        <div style="flex:1;background:#f0faf5;border-radius:12px;padding:20px;text-align:center;border:1px solid #a7f3d0">
          <div style="font-size:36px;font-weight:700;color:#065f46">${iscrizioni.length}</div>
          <div style="font-size:13px;color:#065f46;margin-top:4px">Nuove preiscrizioni</div>
        </div>
        <div style="flex:1;background:#eff6ff;border-radius:12px;padding:20px;text-align:center;border:1px solid #bfdbfe">
          <div style="font-size:36px;font-weight:700;color:#1e40af">${iscrizioni.filter(i => i.idoneo_gol).length}</div>
          <div style="font-size:13px;color:#1e40af;margin-top:4px">Idonei GOL</div>
        </div>
        <div style="flex:1;background:#fff7ed;border-radius:12px;padding:20px;text-align:center;border:1px solid #fed7aa">
          <div style="font-size:36px;font-weight:700;color:#c96a00">${iscrizioni.filter(i => !i.idoneo_gol).length}</div>
          <div style="font-size:13px;color:#c96a00;margin-top:4px">Non idonei</div>
        </div>
      </div>

      <h2 style="font-size:16px;font-weight:700;color:#1a2e5a;margin:0 0 16px">Dettaglio per corso e sede</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="background:#f8fafc">
            <th style="padding:10px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;border-bottom:2px solid #e2e8f0">Corso</th>
            <th style="padding:10px 16px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;border-bottom:2px solid #e2e8f0">Como</th>
            <th style="padding:10px 16px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;border-bottom:2px solid #e2e8f0">Tremezzina</th>
            <th style="padding:10px 16px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#2d7a4f;border-bottom:2px solid #e2e8f0">Idonei GOL</th>
            <th style="padding:10px 16px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#c96a00;border-bottom:2px solid #e2e8f0">Non idonei</th>
            <th style="padding:10px 16px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#1a2e5a;border-bottom:2px solid #e2e8f0">Totale</th>
          </tr>
        </thead>
        <tbody>${righeCorsi}</tbody>
      </table>
    </div>

    <div style="background:#1a2e5a;border-radius:0 0 16px 16px;padding:24px;text-align:center">
      <a href="https://formazionecomolago.it/admin" style="display:inline-block;background:#c8941a;color:white;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px">Accedi alla Dashboard</a>
      <p style="margin:16px 0 0;color:rgba(255,255,255,0.5);font-size:12px">Formazione Como Lago e Valli · Mestieri Lombardia Como</p>
    </div>

  </div>
</body>
</html>`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: DESTINATARI,
    subject: `Report iscrizioni ${dataOggi} — ${iscrizioni.length} nuove preiscrizioni`,
    html
  })

  return new Response(JSON.stringify({ ok: true, iscrizioni: iscrizioni.length }), { status: 200 })
}
