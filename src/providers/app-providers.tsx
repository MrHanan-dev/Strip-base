// providers/app-providers.tsx
'use client'

import { ComponentType, ComponentProps, useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: Readonly<AppProvidersProps>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 60,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withProviders<T extends ComponentType<any>>(Component: T) {
  return function ProviderWrapper(props: ComponentProps<T>) {
    return (
      <AppProviders>
        <Component {...props} />
      </AppProviders>
    )
  }
}
