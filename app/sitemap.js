export default function sitemap() {
  const baseUrl = 'https://formazionecomolago.it'
  
  const corsi = [
    'fatti-impresa', 'business-up', 'digital-marketing-ai',
    'giardinaggio-base', 'addetto-cucina', 'centralinista-receptionist',
    'inglese-base', 'inglese-intermedio', 'business-english',
    'tedesco-base', 'tedesco-intermedio', 'informatica-base',
    'informatica-intermedio', 'intelligenza-artificiale', 'digital-marketing'
  ]

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/come-funziona`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/testimonianze`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/proponi-corso`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/cookie-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ...corsi.map(slug => ({
      url: `${baseUrl}/corsi/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9
    }))
  ]
}
