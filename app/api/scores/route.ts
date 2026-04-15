import { NextRequest, NextResponse } from 'next/server'
// import { supabase } from '../../../lib/supabase'

export async function GET() {
  // Return empty mock data since Supabase is disabled
  return NextResponse.json([])
}

export async function POST(req: NextRequest) {
  // Return success since Supabase is disabled
  return NextResponse.json({ ok: true })
}
