'use client'
import { useState } from 'react'
import { createClient } from '../lib/supabase'

export default function AccountPrompt({ email }) {
  const [password, setPassword] = useState('')
  const [stato, setStato] = useState('idle') // idle | loading | success | error | skip
  const [errore, setErrore] = useState('')

  if (stato === 'skip') return null

  async function handleCrea() {
    if (!password || password.length < 6) {
      setErrore('La password deve essere di almeno 6 caratteri')
      return
    }
    setStato('loading')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      if (error.message.includes('already registered')) {
        setErrore('Hai già un profilo. Accedi da /accedi')
      } else {
        setErrore(error.message)
      }
      setStato('error')
    } else {
      setStato('success')
    }
  }

  if (stato === 'success') {
    return (
      <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
        <p className="text-green-800 font-medium">Profilo creato.</p>
        <p className="text-green-700 text-sm mt-1">Controlla la tua email per confermare il profilo.</p>
      </div>
    )
  }

  return (
    <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
      <h3 className="text-lg font-semibold text-blue-900">
        Vuoi iscriverti più velocemente ai prossimi corsi?
      </h3>
      <p className="text-blue-700 text-sm mt-1 mb-4">
        Crea il tuo profilo e la prossima volta non dovrai reinserire tutti i tuoi dati.
      </p>
      <div className="mb-3">
        <p className="text-sm text-blue-800 mb-1">Email: <strong>{email}</strong></p>
        <input
          type="password"
          placeholder="Scegli una password (min. 6 caratteri)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-blue-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {errore && <p className="text-red-600 text-sm mb-3">{errore}</p>}
      <div className="flex items-center gap-4">
        <button
          onClick={handleCrea}
          disabled={stato === 'loading'}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {stato === 'loading' ? 'Creazione...' : 'Crea il mio profilo'}
        </button>
        <button
          onClick={() => setStato('skip')}
          className="text-blue-600 text-sm underline"
        >
          Continua senza registrarti
        </button>
      </div>
    </div>
  )
}
