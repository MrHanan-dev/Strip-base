import { handlerApiError } from '@/utils/errors/handlerApi'
import axios from 'axios'

export const useStripeService = () => {
  const headers = { 'Content-Type': 'application/json' }

  const checkout = async ({ lookup_key }: Readonly<{ lookup_key: string }>) => {
    try {
      const { data } = await axios('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers,
        data: { lookup_key },
      })

      return data
    } catch (error: unknown) {
      handlerApiError(error)

      return null
    }
  }

  const navigateToStripeDashboard = async () => {
    const { data } = await axios('/api/stripe/create-portal-session', {
      method: 'POST',
      headers,
    })

    if (data?.url) {
      window.location.href = data.url
    } else {
      console.error('Error creating portal session:', data?.error)
    }
  }

  return { checkout, navigateToStripeDashboard }
}
