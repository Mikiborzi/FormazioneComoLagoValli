'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import Link from 'next/link'

export default function ReimpostaPassword() {
  const [password, setPassword]   = useState('')
  const [conferma, setConferma]   = useState('')
  const [mostra, setMostra]       = useState(false)
  const [errore, setErrore]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [successo, setSuccesso]   = useState(false)
  const [pronto, setPronto]       = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setPronto(true)
    })
  }, [])

  async function handleReimposta() {
    if (!password || !conferma) { setErrore('Compila tutti i campi'); return }
    if (password.length < 6) { setErrore('La password deve essere di almeno 6 caratteri'); return }
    if (password !== conferma) { setErrore('Le password non coincidono'); return }
    setLoading(true)
    setErrore('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setErrore('Errore durante il salvataggio. Riprova.')
      setLoading(false)
    } else {
      setSuccesso(true)
    }
  }

  if (successo) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="rounded-xl p-8" style={{ backgroundColor: '#f0faf5', border: '1px solid #a7f3d0' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#065f46' }}>Password aggiornata</h2>
          <p className="text-sm text-green-700">
            La tua password è stata reimpostata con successo.
          </p>
          <Link
            href="/accedi"
            className="inline-block mt-5 text-sm font-medium underline"
            style={{ color: '#1a2e5a' }}
          >
            Vai ad Accedi
          </Link>
        </div>
      </div>
    )
  }

  if (!pronto) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-sm">
          Questa pagina è accessibile solo dal link ricevuto via email.{' '}
          <Link href="/password-dimenticata" className="underline" style={{ color: '#1a2e5a' }}>
            Richiedi un nuovo link
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-2" style={{ color: '#1a2e5a' }}>Reimposta password</h1>
      <p className="text-sm text-gray-500 mb-8">Scegli la tua nuova password.</p>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nuova password</label>
          <div className="relative">
            <input
              type={mostra ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Minimo 6 caratteri"
            />
            <button
              type="button"
              onClick={() => setMostra(!mostra)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              {mostra ? 'Nascondi' : 'Mostra'}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Conferma password</label>
          <input
            type={mostra ? 'text' : 'password'}
            value={conferma}
            onChange={e => setConferma(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ripeti la nuova password"
          />
        </div>
        {errore && <p className="text-red-600 text-sm">{errore}</p>}
        <button
          onClick={handleReimposta}
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: '#1a2e5a' }}
        >
          {loading ? 'Salvataggio...' : 'Salva nuova password'}
        </button>
      </div>
    </div>
  )
}
