import { createClient as CreateServerClient } from '@/utils/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')
  const supabaseServer = CreateServerClient({ isServiceWorker: true })

  let plan
  let stripeEvent

  if (!rawBody) return NextResponse.json({ error: 'Invalid request body' })
  if (!signature) return NextResponse.json({ error: 'Invalid stripe-signature' })

  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return NextResponse.json({
      error: { statusCode: 400, statusMessage: `Webhook error: ${err}` },
    })
  }

  const updateProfilePlan = async (customerId: string, slug: string | null) => {
    const last_plan_update = new Date()

    try {
      if (slug) {
        const [baseSlug] = slug.split('_')

        const { data: planData, error: planError } = await supabaseServer
          .from('pricing_plans')
          .select('id')
          .eq('slug', baseSlug)
          .single()

        if (planError || !planData) {
          console.error('Error fetching plan ID:', planError)
          return
        }

        await supabaseServer
          .from('profiles')
          .update({ is_subscribed: true, last_plan_update, plan_id: planData.id })
          .eq('stripe_customer_id', customerId)
      } else {
        await supabaseServer
          .from('profiles')
          .update({ is_subscribed: false, last_plan_update, plan_id: null })
          .eq('stripe_customer_id', customerId)
      }
    } catch (error) {
      console.log('Error updating profile plan:', error)
    }
  }

  switch (stripeEvent.type) {
    case 'customer.subscription.deleted':
      await updateProfilePlan(stripeEvent?.data?.object?.customer as string, null)
      break

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      plan = stripeEvent.data.object.items.data[0].price.lookup_key
      await updateProfilePlan(stripeEvent?.data?.object?.customer as string, plan)
      break

    default:
      console.log(`Unhandled event type ${stripeEvent.type}.`)
  }

  return NextResponse.json({ received: true })
}
