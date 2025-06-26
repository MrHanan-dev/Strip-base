'use client'

import { useState } from 'react'
import { useSupabaseService } from '@/services/api/supabaseService'

import Image from 'next/image'
import github from '@/assets/images/icons/github.svg'
import linkedin from '@/assets/images/icons/linkedin.svg'

export default function Login() {
  const supabaseService = useSupabaseService()

  const loginWithGithub = async () => {
    supabaseService.loginWithGithub()
  }

  const loginWithLinkedIn = async () => {
    supabaseService.loginWithLinkedIn()
  }

  const loginText = () => (isLogin ? 'You can use your account to log in' : 'You can use your account to register')

  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className='py-8 flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-xl shadow-lg w-full max-w-md'>
        <h2 className='text-2xl font-bold text-center mb-6 text-primary-700'>{isLogin ? 'login' : 'register'}</h2>

        <form>
          <div className='my-6'>
            <p className='text-center mb-4'>{loginText()}</p>
            <div className='flex justify-center space-x-4'>
              <button
                onClick={loginWithGithub}
                className='cursor-pointer flex items-center justify-center outline outline-gray-700 text-gray-700 py-2 px-4 rounded hover:outline-gray-900 hover:shadow-lg hover:bg-slate-50'
              >
                <Image
                  alt='Github'
                  src={github}
                  height='36'
                  width='36'
                  className='mr-2'
                />
                with GitHub
              </button>

              <button
                onClick={loginWithLinkedIn}
                className='cursor-pointer flex items-center justify-center outline outline-blue-700 text-blue-700 py-2 px-3 rounded hover:outline-blue-900 hover:shadow-lg hover:bg-slate-50'
              >
                <Image
                  alt='linkedin'
                  src={linkedin}
                  height='36'
                  width='36'
                  className='mr-2'
                />
                with Linkedin
              </button>
            </div>
          </div>

          {isLogin && (
            <button
              onClick={() => setIsLogin(false)}
              className='text-sm text-primary-700 hover:underline mx-auto block'
            >
              New here? Sign up now →
            </button>
          )}

          {!isLogin && (
            <button
              onClick={() => setIsLogin(true)}
              className='text-sm text-primary-700 hover:underline mx-auto block'
            >
              Return to Login
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
