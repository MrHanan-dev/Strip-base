import { createClient as CreateServerClient } from '@/utils/supabase/server'
import { isEmpty } from 'lodash'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabaseServer = CreateServerClient({})
  const body = await request.json()
  const { lookup_key } = body

  let isSuccess = true

  const { data } = await supabaseServer
    .from('profiles')
    .select('email, is_subscribed, name, stripe_customer_id')
    .single()

  if (!data) {
    throw new Error('Profile data not found')
  }

  const { email, is_subscribed, name } = data
  let { stripe_customer_id } = data

  // Create Stripe customer if it doesn't exist
  if (!stripe_customer_id && email) {
    const customer = await stripe.customers.create({ email, name })

    if (!customer?.id) {
      throw new Error('Failed to create customer')
    }

    stripe_customer_id = customer.id
    await supabaseServer.from('profiles').update({ stripe_customer_id }).eq('email', email)
  }

  // Lookup the plan price in Stripe
  if (email && lookup_key) {
    const { data: prices } = await stripe.prices.list({
      expand: ['data.product'],
      lookup_keys: [lookup_key],
    })

    if (isEmpty(prices)) isSuccess = false

    const planPrice = prices?.[0]
    if (!planPrice) isSuccess = false

    if (isSuccess) {
      // Check if user is already subscribed
      if (is_subscribed) {
        // Get the existing subscription
        const subscriptions = await stripe.subscriptions.list({
          customer: stripe_customer_id,
          status: 'active',
          limit: 1,
        })

        const activeSubscription = subscriptions.data?.[0]

        if (activeSubscription) {
          // Update the subscription with the new price ID
          await stripe.subscriptions.update(activeSubscription.id, {
            items: [
              {
                id: activeSubscription.items.data[0].id,
                price: planPrice.id,
              },
            ],
          })
          return NextResponse.json({ isSuccess, message: 'Subscription updated' })
        }
      }

      // Create a new checkout session if not subscribed
      const session = await stripe.checkout.sessions.create({
        customer: stripe_customer_id,
        billing_address_collection: 'auto',
        line_items: [
          {
            price: planPrice.id,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_SITE_URL}pricing`,
        cancel_url: `${process.env.NEXT_SITE_URL}`,
      })

      return NextResponse.json({ isSuccess, session_id: session.id, plan_id: planPrice.id, url: session?.url })
    } else {
      return NextResponse.json({ isSuccess, message: 'Plan not found' })
    }
  }
}
