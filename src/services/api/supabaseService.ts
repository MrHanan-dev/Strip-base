import type { PricingPlan, Profile } from '@/interfaces'

import { handlerApiError } from '@/utils/errors/handlerApi'
import { supabase } from '@/lib/supabase'

export const useSupabaseService = () => {
  const fetchPricingPlans = async ({
    limit,
    is_featured,
  }: {
    limit?: number
    is_featured?: boolean
  }): Promise<PricingPlan[]> => {
    try {
      limit ??= 1000
      is_featured ??= false

      const selectQuery =
        'id, name, slug, price_monthly, price_yearly, description, cta, most_popular, is_featured, pricing_features(id,name)'

      // Build the query
      let query = supabase.from('pricing_plans').select(selectQuery)

      // Apply filter for isFeatured only if it's defined
      if (typeof is_featured === 'boolean') {
        query = query.eq('is_featured', is_featured)
      }

      const { data, error } = await query.order('price_monthly', { ascending: true }).limit(limit)

      if (error) throw error

      return data
    } catch (error: unknown) {
      // Specify error as unknown here
      handlerApiError(error)
      return []
    }
  }

  const fetchUserProfile = async (): Promise<Profile | null> => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      return null
    }

    if (!user) {
      return null // Return null if there is no user.
    }

    const { data, error } = await supabase
      .from('profiles')
      .select(
        'id, name, first_name, last_name, email, picture, is_subscribed, plan_id, stripe_customer_id, pricing_plans(id, name, slug, price_monthly, price_yearly)'
      )
      .eq('id', user.id)
      .single()

    if (error) {
      console.error(error)
      return null // Return null on error.
    }

    return Array.isArray(data) && data.length > 0 ? data[0] : data ?? {} // Return the user profile data or null if undefined.
  }

  const loginWithLinkedIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${process.env.NEXT_SITE_URL}auth/callback`,
        },
      })
    } catch (error: unknown) {
      // Specify error as unknown here
      handlerApiError(error)
    }
  }

  const loginWithGithub = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `auth/callback`,
        },
      })
    } catch (error: unknown) {
      // Specify error as unknown here
      handlerApiError(error)
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      return { error }
    } catch (error: unknown) {
      // Specify error as unknown here
      handlerApiError(error)
    }
  }

  return {
    fetchPricingPlans,
    fetchUserProfile,

    loginWithGithub,
    loginWithLinkedIn,
    logout,
  }
}
