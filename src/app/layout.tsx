import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ColorSchemeScript } from '@mantine/core'
import Head from 'next/head'

import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import { Notifications } from '@mantine/notifications'

import { ToastContainer } from 'react-toastify'
import ShowInstantNotifications from '@/components/ShowInstantNotifications'
import Header from '@/components/Header'
import Providers from '@/providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <Head>
        <ColorSchemeScript />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Header />
          {children}
          <ToastContainer />
          <Notifications />
          <ShowInstantNotifications />
        </Providers>
      </body>
    </html>
  )
}
