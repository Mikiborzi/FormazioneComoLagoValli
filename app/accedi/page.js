'use client'
import { useState } from 'react'
import { createClient } from '../lib/supabase'
import Link from 'next/link'

export default function Accedi() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [mostra, setMostra]     = useState(false)
  const [errore, setErrore]     = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleAccedi() {
    if (!email || !password) { setErrore('Inserisci email e password'); return }
    setLoading(true)
    setErrore('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErrore('Email o password non corretti')
      setLoading(false)
    } else {
      window.location.href = '/area-personale'
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-2" style={{ color: '#1a2e5a' }}>Accedi</h1>
      <p className="text-sm text-gray-500 mb-8">
        Non hai un profilo?{' '}
        <Link href="/registrati" className="underline" style={{ color: '#1a2e5a' }}>
          Registrati
        </Link>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={mostra ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="La tua password"
            />
            <button
              type="button"
              onClick={() => setMostra(!mostra)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              {mostra ? 'Nascondi' : 'Mostra'}
            </button>
          </div>
          <Link
            href="/password-dimenticata"
            className="block text-xs text-gray-400 hover:text-gray-600 underline mt-1.5"
          >
            Password dimenticata?
          </Link>
        </div>
        {errore && <p className="text-red-600 text-sm">{errore}</p>}
        <button
          onClick={handleAccedi}
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: '#1a2e5a' }}
        >
          {loading ? 'Accesso in corso...' : 'Accedi'}
        </button>
      </div>
    </div>
  )
}
