import '@/app/globals.css'
import type { Metadata } from 'next'
import { AppProviders } from '@/providers/app-providers'
import GeneralLayout from '@/components/layouts/General'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ['200', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Next (14) Stripe with Typescript, TailwindCSS, Supabase and React 18',
  description:
    'Next Stripe has been built with Typescript, TailwindCSS, Supabase and React 18. It is a simple, next & stripe starter kit for developers.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={poppins.className}>
        <AppProviders>
          <GeneralLayout>{children}</GeneralLayout>
        </AppProviders>
      </body>
    </html>
  )
}
