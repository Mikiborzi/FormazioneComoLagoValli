'use client'
import { useState } from 'react'
import { createClient } from '../lib/supabase'
import Link from 'next/link'

export default function PasswordDimenticata() {
  const [email, setEmail]     = useState('')
  const [errore, setErrore]   = useState('')
  const [loading, setLoading] = useState(false)
  const [inviato, setInviato] = useState(false)

  async function handleInvia() {
    if (!email) { setErrore('Inserisci la tua email'); return }
    setLoading(true)
    setErrore('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3002/reimposta-password',
    })
    if (error) {
      setErrore('Errore durante l\'invio. Riprova.')
      setLoading(false)
    } else {
      setInviato(true)
    }
  }

  if (inviato) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="rounded-xl p-8" style={{ backgroundColor: '#f0faf5', border: '1px solid #a7f3d0' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#065f46' }}>Email inviata</h2>
          <p className="text-sm text-green-700">
            Controlla la tua email — ti abbiamo inviato un link per reimpostare la password.
          </p>
          <Link
            href="/accedi"
            className="inline-block mt-5 text-sm font-medium underline"
            style={{ color: '#1a2e5a' }}
          >
            Torna ad Accedi
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-2" style={{ color: '#1a2e5a' }}>Password dimenticata</h1>
      <p className="text-sm text-gray-500 mb-8">
        Inserisci la tua email e ti mandiamo un link per reimpostare la password.
      </p>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="mario.rossi@email.it"
          />
        </div>
        {errore && <p className="text-red-600 text-sm">{errore}</p>}
        <button
          onClick={handleInvia}
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: '#1a2e5a' }}
        >
          {loading ? 'Invio in corso...' : 'Invia link di reset'}
        </button>
        <Link
          href="/accedi"
          className="text-center text-sm text-gray-400 hover:text-gray-600 underline"
        >
          Torna ad Accedi
        </Link>
      </div>
    </div>
  )
}
