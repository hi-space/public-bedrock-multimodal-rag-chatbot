import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import ThemeComponent from '@/components/theme/ThemeComponent'
import ClientProvider from '@/components/theme/ClientProvider'

import Layout from '@/components/theme/Layout'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Multimodal RAG Chat',
  description: 'Multimodal RAG Chat',
  icons: {
    icon: 'icons/icon.png'
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ko'>
      <head>
        <link rel='apple-touch-icon' sizes='180x180' href='/images/apple-touch-icon.png' />
        <link rel='shortcut icon' href='/images/favicon.png' />
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'></meta>
      </head>

      <body className={inter.className}>
        <ClientProvider>
          <ThemeComponent>
            <Layout>{children}</Layout>
          </ThemeComponent>
        </ClientProvider>
      </body>
    </html>
  )
}
