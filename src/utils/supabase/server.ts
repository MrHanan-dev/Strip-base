import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = (payload: { isServiceWorker?: boolean } = {}) => {
  const cookieStore = cookies()
  const isServiceWorker = payload?.isServiceWorker

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    isServiceWorker ? process.env.SUPABASE_SERVICE_ROLE_KEY! : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            console.error('Error setting cookies:', error)
          }
        },
      },
    }
  )
}
