import Image from 'next/image'

import { Check, Sparkles, Shield, CreditCard, Building2, Gauge } from 'lucide-react'
import { Pricing } from '@/components/home'

export default function PricingPage() {
  return (
    <>
      <Pricing />
      <div className='bg-slate-50 py-10'>
        <div className='container mx-auto space-y-12'>
          <div className='flex flex-col md:flex-row items-center gap-8'>
            <div className='md:flex-2'>
              <Image
                src='/images/pricing/1.jpg'
                alt='Transparent Pricing'
                className='w-full h-auto object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'
                width={640}
                height={320}
              />
            </div>
            <div className='md:flex-1 space-y-4 bg-white rounded-xl p-8'>
              <div className='flex items-center gap-2'>
                <Sparkles className='w-8 h-8 text-blue-500' />
                <h3 className='text-2xl font-bold'>Transparent Pricing</h3>
              </div>
              <p className='text-gray-600 leading-relaxed'>
                Discover our crystal-clear pricing model! 💎 No hidden fees, no surprises - just honest and
                straightforward pricing that puts you in control of your investment.
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-green-500' />
                  <span>Clear pricing with no hidden costs</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Shield className='w-5 h-5 text-green-500' />
                  <span>100% transparent billing system</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CreditCard className='w-5 h-5 text-green-500' />
                  <span>Flexible payment options available</span>
                </li>
              </ul>
            </div>
          </div>

          <div className='flex flex-col md:flex-row items-center gap-8'>
            <div className='md:flex-1 px-6 space-y-4 bg-white rounded-xl p-8'>
              <div className='flex items-center gap-2'>
                <Building2 className='w-8 h-8 text-purple-500' />
                <h3 className='text-2xl font-bold'>Flexible Plans</h3>
              </div>
              <p className='text-gray-600 leading-relaxed'>
                Customized solutions for businesses of every size! 🚀 From small startups to enterprise corporations, we
                have the perfect plan to fuel your growth.
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center gap-2'>
                  <Gauge className='w-5 h-5 text-purple-500' />
                  <span>Scalable plans that grow with you</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-purple-500' />
                  <span>Monthly/annual billing options</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Shield className='w-5 h-5 text-purple-500' />
                  <span>Switch plans anytime you need</span>
                </li>
              </ul>
              <div className='inline-block mt-4'>
                <span className='bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full'>
                  30-Day Free Trial 🎁
                </span>
              </div>
            </div>
            <div className='md:flex-2'>
              <Image
                src='/images/pricing/2.jpg'
                alt='Flexible Plans'
                className='w-full h-auto object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'
                width={640}
                height={320}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
