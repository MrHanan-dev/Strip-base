// supabaseService.ts

import type { PricingPlan, Profile } from '@/interfaces'
import { handlerApiError } from '@/utils/errors/handlerApi'
import { supabase } from '@/lib/supabase'
import type { AuthError } from '@supabase/supabase-js'

// Define the service
export const useSupabaseService = () => {

  // Fetch Pricing Plans function
  const fetchPricingPlans = async ({
    limit = 1000,
    is_featured = false,
  }: {
    limit?: number
    is_featured?: boolean
  }): Promise<PricingPlan[]> => {
    try {
      const selectQuery = `
        id, name, slug, 
        description, cta, 
        most_popular, is_featured, 
        pricing_features(id, name)
      `.replace(/\s+/g, ' ').trim()

      let query = supabase.from('pricing_plans').select(selectQuery)

      if (typeof is_featured === 'boolean') {
        query = query.eq('is_featured', is_featured)
      }

      const { data, error } = await query
        .order('name', { ascending: true })  // Order by name or other criteria
        .limit(limit)

      // If there's an error, log and return an empty array
      if (error) {
        console.error('Supabase error:', error)
        return [] // Return empty array if there is an error
      }

      // Ensure 'data' is a valid array and contains 'PricingPlan' objects
      if (!data || !Array.isArray(data)) {
        console.error('Data is not in the expected format:', data)
        return [] // Return empty array if 'data' is not an array
      }

      // Safely map the data to PricingPlan objects with proper type assertion
      return (data as unknown as PricingPlan[]).map((plan) => ({
        id: plan.id ? String(plan.id) : 'Unknown',
        name: plan.name ? String(plan.name) : 'Unknown',
        slug: plan.slug ? String(plan.slug) : 'Unknown',
        description: plan.description || 'No description available',
        cta: plan.cta || 'No CTA available',
        most_popular: plan.most_popular !== undefined ? Boolean(plan.most_popular) : false,
        is_featured: plan.is_featured !== undefined ? Boolean(plan.is_featured) : false,
        pricing_features: plan.pricing_features || [], // If no pricing features, return an empty array
        price_monthly: plan.price_monthly ? Number(plan.price_monthly) : 0,
        price_yearly: plan.price_yearly ? Number(plan.price_yearly) : 0
      }))
    } catch (error: unknown) {
      handlerApiError(error)
      return [] // Return empty array in case of an unexpected error
    }
  }

  // Fetch User Profile function
  const fetchUserProfile = async (): Promise<Profile | null> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        console.warn('No authenticated user found')
        return null
      }

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, name, first_name, last_name,
          email, picture, is_subscribed,
          plan_id, stripe_customer_id,
          pricing_plans(id, name, slug, description, price_monthly, price_yearly)
        `)
        .eq('id', user.id)
        .single()

      if (error || !data) {
        console.error('Profile fetch error:', error)
        return null
      }

      // Log the fetched user profile for debugging
      console.log("Fetched User Profile:", data);

      // Ensure pricing_plans is an array
      const pricingPlans = Array.isArray(data.pricing_plans)
        ? data.pricing_plans
        : [data.pricing_plans]

      // Profile object
      const profile: Profile = {
        id: String(data.id),
        name: String(data.name),
        first_name: data.first_name ? String(data.first_name) : undefined,  // Replace null with undefined
        last_name: data.last_name ? String(data.last_name) : undefined,  // Replace null with undefined
        email: String(data.email),
        picture: data.picture ? String(data.picture) : undefined,  // Replace null with undefined
        is_subscribed: Boolean(data.is_subscribed),
        plan_id: data.plan_id ? String(data.plan_id) : undefined,  // Replace null with undefined
        stripe_customer_id: String(data.stripe_customer_id),
        pricing_plans: pricingPlans.map((plan: PricingPlan) => ({
          id: String(plan.id),
          name: String(plan.name),
          slug: String(plan.slug),
          description: plan.description || 'No description available',
          price_monthly: plan.price_monthly || 0,
          price_yearly: plan.price_yearly || 0
        })),
      }

      return profile
    } catch (error) {
      handlerApiError(error)
      return null
    }
  }

  // Function to login with Github
  const loginWithGithub = async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      })
      return { error }
    } catch (error) {
      handlerApiError(error)
      return { error: error as AuthError }
    }
  }

  // Function to login with LinkedIn
  const loginWithLinkedIn = async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin',
        options: {
          redirectTo: window.location.origin
        }
      })
      return { error }
    } catch (error) {
      handlerApiError(error)
      return { error: error as AuthError }
    }
  }

  // Function to logout
  const logout = async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      handlerApiError(error)
      return { error: error as AuthError }
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
