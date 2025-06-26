'use client'

import type { PricingPlan, Profile } from '@/interfaces'
import { Icon } from '@/components/ui'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useStripeService, useSupabaseService } from '@/services/api'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useRouter } from 'next/navigation'
import { isEmpty } from 'lodash'

const PRICING_QUERY_KEY = ['pricing-plans'] as const

export function Pricing() {
  const router = useRouter()
  const supabaseService = useSupabaseService()
  const stripeService = useStripeService()
  const { profile } = useUserProfile()
  const [isLoading, setIsLoading] = useState(false)
  const [isYearly, setIsYearly] = useState(false)

  const { data: pricingPlans = [] } = useQuery({
    queryKey: PRICING_QUERY_KEY,
    queryFn: () => supabaseService.fetchPricingPlans({}),
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour since it is not an always changing data
  })

  const subscribe = async (slug: string) => {
    setIsLoading(true)

    if (!profile) return router.push('/login')

    const lookup_key = `${slug}_${isYearly ? 'yearly' : 'monthly'}`

    const res = await stripeService.checkout({ lookup_key })
    if (profile) profile.pricing_plans = res.pricing_plans
    if (res?.url) window.location.href = res.url

    setIsLoading(false)
  }

  const renderPriceSection = (plan: PricingPlan) => (
    <p className='mt-8 flex items-baseline'>
      <span
        className='text-4xl font-extrabold text-secondary-500 transition-all duration-500 ease-in-out transform'
        style={{
          opacity: isYearly ? 1 : 0.8,
          transform: isYearly ? 'translateY(0)' : 'translateY(-5px)',
        }}
      >
        ${isYearly ? plan.price_yearly : plan.price_monthly}
      </span>
      <span
        className='ml-2 text-base font-medium text-secondary-500 transition-all duration-500 ease-in-out transform'
        style={{
          opacity: isYearly ? 1 : 0.8,
          transform: isYearly ? 'translateY(0)' : 'translateY(5px)',
        }}
      >
        /{isYearly ? 'year' : 'month'}
      </span>
    </p>
  )

  const renderFeatures = (plan: PricingPlan) => (
    <ul className='mt-8 space-y-4'>
      {plan?.pricing_features &&
        plan.pricing_features.map(({ id, name }) => (
          <li
            key={id}
            className='flex items-start'
          >
            <div className='flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center'>
              <Icon
                name='checkCircle'
                className='h-5 w-5 text-green-500'
              />
            </div>
            <p className='ml-3 text-base text-gray-500'>{name}</p>
          </li>
        ))}
    </ul>
  )

  const renderPricingCard = (isLoading: boolean, plan: PricingPlan) => (
    <div
      key={plan.name}
      className={`relative bg-white p-6 rounded-xl shadow-sm border ${
        plan.most_popular ? 'border-primary-600 bg-primary-50 scale-105 transform' : 'border-gray-200'
      }`}
    >
      {plan.most_popular && <p className='text-primary-600 font-bold text-sm uppercase tracking-wide'>Most Popular</p>}
      <h3 className='mt-2 text-xl leading-6 font-semibold text-secondary-600'>{plan.name}</h3>
      <p className='mt-4 text-gray-500'>{plan.description}</p>
      {renderPriceSection(plan)}
      {renderFeatures(plan)}

      <div className='mt-8'>
        <PricingButton
          isLoading={isLoading}
          plan={plan}
          profile={profile}
          onSubscribe={subscribe}
        />
      </div>
    </div>
  )

  const PricingTableSkeleton = () => {
    const Card = ({ isPopular = false }) => (
      <div
        className={`relative bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse
      ${isPopular ? 'scale-105 bg-gray-50 border-primary-500' : ''}`}
      >
        {/* Title Skeleton */}
        <div className='h-4 bg-gray-200 rounded w-24'></div>

        {/* Description Skeleton */}
        <div className='mt-4 h-3 bg-gray-200 rounded w-48'></div>

        {/* Price Skeleton */}
        <div className='mt-8 flex items-baseline'>
          <div className='h-8 bg-gray-200 rounded w-20'></div>
          <div className='ml-2 h-4 bg-gray-200 rounded w-16'></div>
        </div>

        {/* Features List Skeleton */}
        <div className='mt-8 space-y-4'>
          {[1, 2, 3].map(item => (
            <div
              key={item}
              className='flex items-start'
            >
              <div className='flex-shrink-0 h-6 w-6 rounded-full bg-gray-200'></div>
              <div className='ml-3 h-3 bg-gray-200 rounded w-32'></div>
            </div>
          ))}
        </div>

        {/* Button Skeleton */}
        <div className='mt-8'>
          <div className='w-full h-10 bg-gray-200 rounded'></div>
        </div>
      </div>
    )

    return (
      <div className='mt-10 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3'>
        <Card />
        <div className='relative'>
          {/* Popular badge skeleton */}
          <div className='absolute -top-4 left-0 right-0 mx-auto w-32 h-4 bg-primary-500 rounded z-10'></div>
          <Card isPopular={true} />
        </div>
        <Card />
      </div>
    )
  }

  return (
    <section className='bg-white py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='lg:text-center'>
          <h2 className='text-base text-primary-600 font-semibold tracking-wide uppercase'>Pricing</h2>
          <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-secondary-600 sm:text-4xl'>
            Simple, transparent pricing
          </p>
          <p className='mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto'>Choose the plan that fits your needs.</p>
        </div>

        {isEmpty(pricingPlans) && <PricingTableSkeleton />}

        {!isEmpty(pricingPlans) && (
          <>
            <div className='relative w-full h-full flex justify-center items-center'>
              <div className='flex items-center justify-center space-x-6 mt-5 h-7'>
                <span className='text-sm font-medium text-gray-600 transition-colors duration-300'>Monthly</span>

                <div className='relative group'>
                  <input
                    checked={isYearly}
                    id='isYearly'
                    type='checkbox'
                    className='peer appearance-none w-14 h-7 rounded-full bg-gray-200 
                 checked:bg-primary-500 cursor-pointer transition-all duration-300 
                 hover:bg-gray-300 checked:hover:bg-primary-600'
                    onChange={() => setIsYearly(!isYearly)}
                  />
                  <label
                    htmlFor='isYearly'
                    className='absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full 
                 border border-gray-300 shadow-sm transition-all duration-300 
                 peer-checked:translate-x-7 peer-checked:border-primary-200 
                 group-hover:scale-95 cursor-pointer'
                  />
                </div>

                <div className='flex items-center'>
                  <span className='text-sm font-medium text-gray-600 transition-colors duration-300'>Yearly</span>
                </div>
              </div>
            </div>

            <div className='text-center mt-4'>
              <span
                className={`inline-block mx-auto items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ${
                  isYearly ? 'opacity-100' : 'opacity-50'
                }`}
              >
                2 months free by paying yearly
              </span>
            </div>
            <div className='mt-10 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3'>
              {pricingPlans.map(plan => renderPricingCard(isLoading, plan))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

const PricingButton = ({
  isLoading,
  plan,
  profile,
  onSubscribe,
}: Readonly<{
  isLoading: boolean
  plan: PricingPlan
  profile: Profile | null
  onSubscribe: (slug: string) => void
}>) => {
  const isCurrentPlan = profile?.pricing_plans?.id === plan.id
  const isUpgrade = profile?.pricing_plans ? profile?.pricing_plans?.price_monthly < plan.price_monthly : false
  const stripeService = useStripeService()

  const getButtonLabel = () => {
    if (isCurrentPlan) return 'Manage Subscription'
    if (isUpgrade) return '⬆️ Upgrade Plan'
    if (profile?.pricing_plans) return '⬇️ Downgrade Plan'

    return plan.cta
  }

  const subscribe = () => {
    if (profile?.pricing_plans) {
      stripeService.navigateToStripeDashboard()
    } else {
      onSubscribe(plan.slug)
    }
  }

  const getCustomClasses = () => {
    if (plan.most_popular) return 'bg-primary-600 hover:bg-primary-700'

    return 'bg-secondary-600 hover:bg-secondary-700'
  }

  return (
    <>
      {isLoading && (
        <button className='bg-gray-300 text-secondary-500 rounded w-full h-10 animate-pulse cursor-not-allowed'>
          Please wait...
        </button>
      )}

      {!isLoading && (
        <button
          disabled={isLoading}
          onClick={() => subscribe()}
          className={`block w-full text-center py-2 px-4 rounded text-white ${getCustomClasses()}`}
        >
          {getButtonLabel()}
        </button>
      )}
    </>
  )
}
