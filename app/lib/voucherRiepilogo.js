// Costruisce il documento HTML di riepilogo della pratica Voucher Formazione
// Continua, usato per la stampa/salvataggio PDF dal browser dell'azienda.

function esc(v) {
  if (v === null || v === undefined || v === '') return '—'
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function riga(label, valore) {
  return `<tr>
    <td style="padding:5px 10px;color:#64748b;font-size:12px;white-space:nowrap;vertical-align:top">${label}</td>
    <td style="padding:5px 10px;color:#0f172a;font-size:12px;font-weight:500">${esc(valore)}</td>
  </tr>`
}

export function buildRiepilogoDocumento({ azienda, partecipanti }) {
  const nPart = (partecipanti || []).length

  const lista = (partecipanti || []).map((p, i) => `
    <div style="border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;margin-bottom:10px;break-inside:avoid">
      <p style="margin:0 0 6px;font-weight:700;color:#1e3a8a;font-size:13px">${i + 1}. ${esc(p.nome)} ${esc(p.cognome)}</p>
      <table style="border-collapse:collapse;width:100%">
        ${riga('Codice fiscale', p.codice_fiscale)}
        ${riga('Data / luogo nascita', `${p.data_nascita || '—'} · ${p.luogo_nascita || '—'}`)}
        ${riga('Sesso / cittadinanza', `${p.sesso || '—'} · ${p.cittadinanza || '—'}`)}
        ${riga('Titolo di studio', p.titolo_studio)}
        ${riga('Residenza', `${p.indirizzo || '—'}, ${p.comune || '—'} (${p.provincia || '—'}) ${p.cap || ''}`)}
        ${riga('Rapporto di lavoro', p.tipologia_rapporto)}
        ${riga('N. COB', p.numero_cob)}
        ${riga('Data assunzione', p.data_assunzione)}
        ${riga('Orario', p.orario_lavoro)}
        ${riga('Partita IVA', p.partita_iva)}
        ${riga('Email / telefono', `${p.email || '—'} · ${p.telefono || '—'}`)}
      </table>
    </div>`).join('')

  const body = `
    <div style="max-width:760px;margin:0 auto;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a">
      <div style="border-bottom:3px solid #1e3a8a;padding-bottom:12px;margin-bottom:16px">
        <p style="margin:0 0 2px;color:#1e3a8a;font-size:11px;text-transform:uppercase;letter-spacing:.5px;font-weight:700">Regione Lombardia · PR FSE+ 2021-2027</p>
        <h1 style="margin:0;font-size:20px">Preregistrazione Voucher Formazione Continua</h1>
        <p style="margin:4px 0 0;color:#64748b;font-size:13px">Riepilogo pratica — ${nPart} partecipant${nPart === 1 ? 'e' : 'i'}</p>
      </div>

      <h2 style="font-size:15px;margin:0 0 8px">Azienda</h2>
      <table style="border-collapse:collapse;width:100%;margin-bottom:8px">
        ${riga('Ragione sociale', azienda.ragione_sociale)}
        ${riga('P.IVA / C.F.', azienda.piva_cf)}
        ${riga('Codice ATECO', azienda.codice_ateco)}
        ${riga('Sede operativa', azienda.sede_operativa)}
        ${riga('Numero addetti', azienda.numero_addetti)}
        ${riga('Referente', `${azienda.referente_nome || ''} ${azienda.referente_cognome || ''}`.trim())}
        ${riga('Email referente', azienda.referente_email)}
        ${riga('Telefono referente', azienda.referente_telefono)}
        ${riga('Legale rappresentante', `${azienda.legale_rappresentante_nome || ''} ${azienda.legale_rappresentante_cognome || ''}`.trim())}
        ${riga('C.F. legale rappr.', azienda.legale_rappresentante_cf)}
      </table>

      <h2 style="font-size:15px;margin:20px 0 8px">Partecipanti (${nPart})</h2>
      ${lista || '<p style="color:#64748b;font-size:13px">Nessun partecipante registrato.</p>'}

      <div style="margin-top:16px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px 14px;break-inside:avoid">
        <p style="margin:0;font-size:12px;color:#1e40af">
          Per <strong>visualizzare, modificare o integrare</strong> questa pratica in un secondo momento,
          torna alla pagina del voucher e scegli <strong>«Riprendi pratica»</strong> inserendo la
          <strong>P.IVA/C.F.</strong> e l'<strong>email del referente</strong> usati qui.
          Nessuna password necessaria.
        </p>
      </div>

      <p style="margin-top:24px;font-size:10px;color:#94a3b8;text-align:center;border-top:1px solid #e2e8f0;padding-top:10px">
        Starting Work Srl Impresa Sociale · Programma PR Lombardia FSE+ 2021-2027 · Voucher Aziendali a Catalogo — Quarta Edizione
      </p>
    </div>`

  // Documento completo con stampa automatica all'apertura.
  return `<!doctype html><html lang="it"><head><meta charset="utf-8">
    <title>Riepilogo pratica — ${esc(azienda.ragione_sociale)}</title>
    <style>@page{margin:16mm} body{margin:0;padding:20px;background:white}</style>
    </head><body onload="window.print()">${body}</body></html>`
}
