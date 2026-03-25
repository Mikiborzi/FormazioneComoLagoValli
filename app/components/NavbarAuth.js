'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../lib/supabase'

export default function NavbarAuth() {
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
    window.location.reload()
  }

  if (loading) return null

  if (user) {
    return (
      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/area-personale"
          className="font-sans text-sm font-medium text-white/85 hover:text-white transition-colors"
        >
          La mia area
        </Link>
        <button
          onClick={handleLogout}
          className="font-sans text-sm text-white/60 hover:text-white/85 transition-colors"
        >
          Esci
        </button>
      </div>
    )
  }

  return (
    <div className="hidden md:flex items-center gap-2">
      <Link
        href="/accedi"
        className="font-sans text-sm font-medium px-4 py-1.5 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors"
      >
        Accedi
      </Link>
      <Link
        href="/registrati"
        className="font-sans text-sm font-medium px-4 py-1.5 rounded-lg text-white transition-colors"
        style={{ backgroundColor: '#c8941a' }}
      >
        Registrati
      </Link>
    </div>
  )
}
