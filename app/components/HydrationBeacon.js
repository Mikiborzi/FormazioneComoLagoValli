'use client'

import { useEffect } from 'react'

// Marca l'HTML quando React è partito davvero. Lo script inline in layout.js
// controlla questo attributo: se manca, significa che il bundle non si è
// avviato (browser troppo vecchio, script bloccato, rete interrotta) e mostra
// l'avviso al posto di una pagina muta in cui i pulsanti non rispondono.
export default function HydrationBeacon() {
  useEffect(() => {
    document.documentElement.setAttribute('data-hydrated', '1')
    // Se l'avviso era già comparso (avvio lento, errore di rete non fatale),
    // ritirarlo appena React parte: il sito funziona.
    const avviso = document.getElementById('avviso-browser')
    if (avviso) avviso.style.display = 'none'
  }, [])

  return null
}
