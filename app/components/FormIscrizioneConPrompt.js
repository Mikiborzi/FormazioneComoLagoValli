'use client'
import { useState } from 'react'
import FormIscrizione from './FormIscrizione'
import AccountPrompt from './AccountPrompt'

export default function FormIscrizioneConPrompt({ corsoPreselezionato }) {
  const [emailSuccesso, setEmailSuccesso] = useState(null)

  return (
    <>
      <FormIscrizione
        corsoPreselezionato={corsoPreselezionato}
        onSuccess={(email) => setEmailSuccesso(email)}
      />
      {emailSuccesso && <AccountPrompt email={emailSuccesso} />}
    </>
  )
}
