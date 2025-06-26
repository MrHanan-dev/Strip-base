'use client'

const features = [
  {
    name: '💳 Stripe Integration',
    description: 'Seamlessly integrated with Stripe for payment processing.',
  },
  {
    name: '⚡ Built with TypeScript',
    description: 'Strongly typed and scalable with TypeScript for faster development.',
  },
  {
    name: '🛠️ Powered by Supabase',
    description: 'Leverage the power of Supabase for real-time database and authentication.',
  },
  {
    name: '🎨 Tailwind CSS',
    description: 'Responsive and modern designs with Tailwind CSS.',
  },
  {
    name: '🚀 Ready to Scale',
    description: 'Everything you need to scale fast and efficiently.',
  },
  {
    name: '🔒 Secure Authentication',
    description: 'Advanced security with secure authentication and user management.',
  },
]

export function Features() {
  return (
    <section className='bg-slate py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='lg:text-center'>
          <h2 className='text-base text-primary-600 font-semibold tracking-wide uppercase'>🚀 Features</h2>
          <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-secondary-900 sm:text-4xl'>
            Everything you need to build and scale fast
          </p>
          <p className='mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto'>
            Our SaaS starter is packed with all the essentials to kickstart your project.
          </p>
        </div>

        <div className='mt-10'>
          <dl className='space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10'>
            {features.map(feature => (
              <div
                key={feature.name}
                className='relative'
              >
                <dt>
                  <p className='ml-9 text-lg leading-6 font-medium text-primary-900'>{feature.name}</p>
                </dt>
                <dd className='mt-2 ml-9 text-base text-gray-500'>{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
