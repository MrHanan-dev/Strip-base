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

      return data ?? []
    } catch (error: unknown) {
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
      return null
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
      return null
    }

    if (!data) return null

    // Explicitly cast and transform pricing_plans to match PricingPlan[]
    const profile: Profile = {
      id: data.id,
      name: data.name,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      picture: data.picture,
      is_subscribed: data.is_subscribed,
      plan_id: data.plan_id,
      stripe_customer_id: data.stripe_customer_id,
      pricing_plans: Array.isArray(data.pricing_plans)
        ? data.pricing_plans.map((plan: any) => ({
            id: plan.id,
            name: plan.name,
            slug: plan.slug,
            price_monthly: plan.price_monthly,
            price_yearly: plan.price_yearly,
          }))
        : [],
    }

    return profile
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
      handlerApiError(error)
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error: unknown) {
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
