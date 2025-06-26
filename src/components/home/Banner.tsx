'use client'

export function Banner() {
  return (
    <section className='bg-gradient-to-r from-primary-400 to-blue-300 py-16 relative'>
      <div className='container mx-auto max-w-full'>
        <div className='flex flex-col text-center max-w-full'>
          <div className='relative z-10'>
            <div className='mt-4 font-semibold text-[40px] lg:text-7xl xl:text-7xl leading-tight text-secondary-700'>
              Next.js SaaS Starter with Stripe
            </div>
            <div className='text-lg lg:text-xl xl:text-3xl text-white mt-8'>
              💡 Includes Stripe integration 💳 TypeScript 📝 Supabase 🔐 Tailwind CSS 🎨
              <br />
              —everything you need to build and scale fast!
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
