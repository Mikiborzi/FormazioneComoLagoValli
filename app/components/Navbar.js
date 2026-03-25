'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../lib/supabase'

const navItems = [
  { label: 'Come Funziona', href: '#come-funziona' },
  { label: 'I Corsi', href: '#corsi' },
  { label: 'Testimonianze', href: '#testimonianze' },
  { label: 'Contatti', href: '#contatti' },
]

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: '#e2e8f0' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-sm" style={{ color: '#1a2e5a' }}>
          Formazione Como Lago e Valli
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {!loading && (
            user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/area-personale"
                  className="text-sm font-medium hidden md:block"
                  style={{ color: '#1a2e5a' }}
                >
                  La mia area
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-400 hover:text-gray-600 hidden md:block"
                >
                  Esci
                </button>
              </div>
            ) : (
              <Link
                href="/accedi"
                className="text-sm font-medium px-4 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
                style={{ color: '#1a2e5a', borderColor: '#1a2e5a' }}
              >
                Accedi
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}
