'use client'

import Image from 'next/image'

const testimonials = [
  {
    name: 'John Doe',
    role: 'CEO, NextJS',
    imageUrl: 'john.jpg',
    feedback:
      'This service has transformed the way we work. The integration with Stripe and Supabase is flawless, and scaling has never been easier.',
  },
  {
    name: 'Jane Smith',
    role: 'CTO, ReactJS',
    imageUrl: 'jane.jpg',
    feedback:
      'The features provided have drastically improved our development workflow. Built with TypeScript and Tailwind CSS, it’s a dream to work with!',
  },
  {
    name: 'Emily Johnson',
    role: 'Lead Developer, CREAMIVE',
    imageUrl: 'emily.jpg',
    feedback:
      'Amazing service with excellent support! It’s everything we needed to launch quickly and scale efficiently.',
  },
]

export function Testimonials() {
  return (
    <section className='bg-slate-50 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='lg:text-center'>
          <h2 className='text-base text-primary-600 font-semibold tracking-wide uppercase'>What Our Customers Say</h2>
          <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-secondary-600 sm:text-4xl'>
            Hear from our happy clients
          </p>
        </div>

        <div className='mt-10 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3'>
          {testimonials.map(testimonial => (
            <div
              key={testimonial.name}
              className='bg-white p-6 rounded-xl shadow-sm'
            >
              <div className='flex items-center space-x-4'>
                <Image
                  className='h-12 w-12 rounded-full object-cover'
                  src={`/images/testimonials/small/${testimonial.imageUrl}`}
                  alt={`${testimonial.name} profile picture`}
                  width={48}
                  height={48}
                />
                <div>
                  <p className='text-lg font-medium text-secondary-500'>{testimonial.name}</p>
                  <p className='text-sm text-gray-500'>{testimonial.role}</p>
                </div>
              </div>
              <p className='mt-4 text-base text-gray-600'>&quot; {testimonial.feedback} &quot;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
