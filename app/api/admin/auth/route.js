import { NextResponse } from 'next/server'

export async function POST(request) {
  const { password } = await request.json()
  if (password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ token: process.env.ADMIN_SESSION_TOKEN })
  }
  return NextResponse.json({ error: 'Password non corretta' }, { status: 401 })
}
