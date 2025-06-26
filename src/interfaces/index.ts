export type { User } from './User'

export type PricingPlan = {
  id?: string
  name: string
  slug: string
  price_monthly: number
  price_yearly: number
  description?: string
  cta?: string
  most_popular?: boolean
  is_featured?: boolean
  pricing_features?: PricingFeatures[]
  created_at?: string
}

export interface PricingFeatures {
  id?: string
  name: string
  plan_id?: string
  created_at?: string
}

export interface Profile {
  id?: string
  first_name?: string
  last_name?: string
  email: string
  picture?: string
  name?: string
  is_subscribed: boolean
  plan_id?: string
  pricing_plans?: PricingPlan
  stripe_customer_id?: string
  last_plan_update?: string
}
