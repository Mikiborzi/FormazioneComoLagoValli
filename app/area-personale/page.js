'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import Link from 'next/link'

const STATI_BADGE = {
  nuovo:       { label: 'In attesa',   color: '#6b7280', bg: '#f3f4f6' },
  contattato:  { label: 'Contattato',  color: '#92400e', bg: '#fef3c7' },
  iscritto:    { label: 'Iscritto',    color: '#065f46', bg: '#d1fae5' },
  in_attesa:   { label: 'In attesa',   color: '#1e40af', bg: '#dbeafe' },
  non_idoneo:  { label: 'Non idoneo',  color: '#991b1b', bg: '#fee2e2' },
}

export default function AreaPersonale() {
  const [user, setUser]           = useState(null)
  const [iscrizioni, setIscrizioni] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/accedi'
        return
      }
      setUser(user)
      const { data } = await supabase
        .from('iscrizioni')
        .select('id, corsi_interesse, sedi_preferite, stato, created_at')
        .eq('email', user.email)
        .order('created_at', { ascending: false })
      setIscrizioni(data || [])
      setLoading(false)
    }
    init()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Caricamento...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1a2e5a' }}>
            La tua area personale
          </h1>
          <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 underline hover:text-gray-700"
        >
          Esci
        </button>
      </div>

      {/* Iscrizioni */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a2e5a' }}>
          Le tue preiscrizioni
        </h2>
        {iscrizioni.length === 0 ? (
          <div className="rounded-xl p-6 text-center" style={{ border: '1px solid #e2e8f0' }}>
            <p className="text-gray-500 text-sm">Non hai ancora preiscrizioni attive.</p>
            <Link
              href="/#corsi"
              className="inline-block mt-3 text-sm font-medium underline"
              style={{ color: '#1a2e5a' }}
            >
              Scopri i corsi disponibili
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {iscrizioni.map((iscr) => {
              const badge = STATI_BADGE[iscr.stato] || STATI_BADGE.nuovo
              const corsi = Array.isArray(iscr.corsi_interesse)
                ? iscr.corsi_interesse.join(', ')
                : iscr.corsi_interesse
              const data = new Date(iscr.created_at).toLocaleDateString('it-IT')
              return (
                <div
                  key={iscr.id}
                  className="rounded-xl p-5"
                  style={{ border: '1px solid #e2e8f0' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm" style={{ color: '#1a2e5a' }}>
                        {corsi}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Preiscritto il {data}
                      </p>
                    </div>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
                      style={{ color: badge.color, backgroundColor: badge.bg }}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA aggiungi corso */}
      <div
        className="rounded-xl p-6 text-center"
        style={{ backgroundColor: '#f0faf5', border: '1px solid #a7f3d0' }}
      >
        <p className="text-sm font-medium mb-3" style={{ color: '#065f46' }}>
          Vuoi preiscriverti a un altro corso?
        </p>
        <Link
          href="/#corsi"
          className="inline-block bg-white text-sm font-medium px-5 py-2 rounded-lg hover:shadow-sm transition-shadow"
          style={{ color: '#1a2e5a', border: '1px solid #a7f3d0' }}
        >
          Vai ai corsi
        </Link>
      </div>
    </div>
  )
}
