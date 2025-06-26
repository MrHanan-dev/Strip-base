'use client'

import Image from 'next/image'

import isEmpty from 'lodash/isEmpty'
import Link from 'next/link'
import { Logo } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { User } from '@/interfaces'
import { useRouter } from 'next/navigation'
import { useSupabaseService } from '@/services/api/supabaseService'

export function Header() {
  const supabaseService = useSupabaseService()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [picture, setPicture] = useState('')

  const [state, setState] = useState({
    isMenuOpen: false,
    isMobileMenuOpen: false,
  })

  const userMenu: { name: string; url: string }[] = [
    { name: 'Profile', url: 'profile' },
    { name: 'Subscriptions', url: 'subscriptions' },
  ]

  const toggleDropdown = () => {
    setState(prevState => ({
      ...prevState,
      isMenuOpen: !prevState.isMenuOpen,
    }))
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: User | null } | null) => {
        if (session?.user) {
          const user: User = {
            ...session.user,
            ...session.user?.user_metadata,
          }

          setPicture(user?.user_metadata?.avatar_url ?? '')
          setUser(user)
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const logout = async () => {
    await supabaseService.logout()
    setUser(null)
    router.push('/login')
  }

  return (
    <header className='bg-white border-gray-200 dark:bg-gray-800'>
      <nav className='container mx-auto flex justify-between items-center px-4 lg:px-6 py-2.5'>
        <div className='flex items-center'>
          <Logo />
        </div>

        <div className='flex items-center space-x-3'>
          <Link
            href='/features'
            className='bg-primary-500 text-white hover:bg-secondary-500 focus:ring-4 font-medium rounded text-sm px-5 py-2.5 dark:bg-blue-500 dark:hover:bg-primary-600 focus:outline-none hidden sm:inline-block'
          >
            Features
          </Link>

          <Link
            href='/pricing'
            className='bg-secondary-500 text-white hover:bg-primary-500 focus:ring-4 font-medium rounded text-sm px-5 py-2.5 dark:bg-blue-500 dark:hover:bg-primary-600 focus:outline-none hidden sm:inline-block'
          >
            Pricing
          </Link>

          {isEmpty(user) && (
            <Link
              href='/login'
              className='text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'
            >
              Login
            </Link>
          )}
          {!isEmpty(user) && (
            <div className='relative'>
              <button
                className='relative inline-block text-left'
                onClick={toggleDropdown}
              >
                <div className='no-select flex items-center cursor-pointer text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'>
                  {picture && (
                    <Image
                      src={picture}
                      className='h-6 w-6 rounded-full mr-2'
                      alt={user?.name ?? ''}
                      width={24}
                      height={24}
                    />
                  )}
                  <span className='mr-1'>{user?.name?.split(' ')?.[0] || ''}</span>
                  {state.isMenuOpen ? '▲' : '▼'}
                </div>
              </button>

              {state.isMenuOpen && (
                <div className='absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded shadow-lg z-20'>
                  <ul className='py-1 text-sm text-gray-700 dark:text-gray-200'>
                    {userMenu.map(({ name, url }) => (
                      <li key={url}>
                        <Link
                          href={`/user/${url}`}
                          className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'
                        >
                          {name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={logout}
                        className='cursor-pointer block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
