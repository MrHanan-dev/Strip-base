'use client'

import Link from 'next/link'

const links: { name: string; url: string }[] = [
  { name: 'Homepage', url: '/' },
  { name: 'Features', url: '/features' },
  { name: 'Pricing', url: '/pricing' },
]

export function Footer() {
  return (
    <footer className='bg-white py-8 px-6'>
      <div className='container mx-auto text-center'>
        <nav className='space-x-6 mb-4'>
          {links.map(link => (
            <Link
              key={link.url}
              className='text-gray-700 hover:text-blue-500 cursor-pointer py-3 inline-block sm:py-0'
              href={link.url}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <p className='text-gray-500'>
          © 2024{' '}
          <a
            href='https://www.reactcompanies.com/'
            target='_blank'
          >
            ReactCompanies
          </a>
          . All rights reserved.
        </p>
        <p className='block cursor-pointer text-gray-800 text-xs mt-4 opacity-90 transition duration-300 ease-in-out transform hover:scale-105 hover:text-gray-800 hover:opacity-100'>
          Made with 🚀 React 18, 🔥 Next 14, 🔧 Typescript, 🎁 TailwindCSS, 💚 Supabase, 💳 Stripe and ❤️ in 📍 Istanbul
        </p>
      </div>
    </footer>
  )
}
