import { createClient as CreateServerClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST() {
  try {
    const supabaseServer = CreateServerClient({})

    const { data } = await supabaseServer.from('profiles').select('stripe_customer_id').single()

    if (!data) {
      throw new Error('Profile data not found')
    }
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: process.env.NEXT_SITE_URL,
    })

    return NextResponse.json({ url: portalSession?.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    return NextResponse.json({ error: 'Error creating portal session' })
  }
}
