'use client'

import Image from 'next/image'

import githubIcon from '@/assets/images/icons/github.svg'
import linkedinIcon from '@/assets/images/icons/linkedin.svg'
import mediumIcon from '@/assets/images/icons/medium.svg'

// Define the type for social keys
type SocialKey = 'github' | 'linkedin' | 'medium'

const socials: Record<SocialKey, string> = {
  github: 'https://github.com/mustafacagri',
  linkedin: 'https://www.linkedin.com/in/mustafacagri',
  medium: 'https://mustafacagri.medium.com/',
}

const icons = {
  github: githubIcon,
  linkedin: linkedinIcon,
  medium: mediumIcon,
}

export function Bottom() {
  return (
    <div className='bg-secondary-700 text-white py-10 px-6 sm:px-12'>
      <div className='container mx-auto'>
        <div className='flex flex-col sm:flex-row sm:justify-between gap-12'>
          <div className='mb-6 sm:mb-0 sm:w-1/3'>
            <h3 className='text-xl font-bold mb-4'>🚀 Ready to boost your React skills?</h3>
            <p className='text-gray-300'>
              Join <strong>ReactCompanies</strong> today and explore a world of opportunities for React developers.
              Whether you&apos;re a junior or a senior, we have something for everyone. 🚀 Build, collaborate, and level
              up your career with the best in the business!
            </p>
          </div>

          <div className='mb-6 sm:mb-0 sm:w-1/3'>
            <h3 className='text-xl font-bold mb-4'>💚 Why ReactCompanies?</h3>

            <p>🌟 Access exclusive job listings tailored for React developers.</p>
            <p>💼 Connect with top companies and showcase your React skills.</p>
            <p>🚀 Stay ahead with the latest industry trends and tips.</p>
          </div>

          <div className='sm:w-1/3'>
            <h3 className='text-xl font-bold mb-4'>🗣️ Let&apos;s connect!</h3>

            <p>📩 Follow us on our social channels for updates, articles, and more.</p>
            <p className='mt-2'>📢 Don&apos;t miss out on valuable insights from the React community.</p>

            <div className='flex space-x-4 mt-4'>
              {Object.entries(icons).map(([social, icon]) => (
                <a
                  key={social}
                  href={socials[social as SocialKey]}
                  className='bg-white rounded-full p-4 hover:bg-slate-200'
                >
                  <Image
                    src={icon}
                    alt={social}
                    width={24}
                    height={24}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
