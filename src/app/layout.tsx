import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ColorSchemeScript } from '@mantine/core'
import Head from 'next/head'
import { createTheme, MantineProvider } from '@mantine/core'

import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import { DatesProvider } from '@mantine/dates'
import { Notifications } from '@mantine/notifications'
import { ContactsStoreProvider } from '@/store/contactsProvider'
import { prisma } from '@prisma-client'

import { ToastContainer } from 'react-toastify'
import { auth } from '@/auth'
import { ContactType } from '@/store/contacts'
import ShowInstantNotifications from '@/components/ShowInstantNotifications'
import { SessionProvider } from 'next-auth/react'
import Header from '@/components/Header'

const theme = createTheme({
  /** Put your mantine theme override here */
})

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

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  let userData: { Contacts: ContactType[] } | null = null
  if (session && session.user)
    userData = await prisma.user.findFirst({
      where: { id: session.user.id },
      select: {
        Contacts: { select: { id: true, name: true, userName: true } }
      }
    })

  return (
    <html lang='en'>
      <Head>
        <ColorSchemeScript />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session} basePath='/auth'>
          <ContactsStoreProvider contacts={userData?.Contacts ?? []}>
            <MantineProvider theme={theme} defaultColorScheme='auto'>
              <DatesProvider settings={{ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }}>
                <Header />
                {children}
                <ToastContainer />
                <Notifications />
                <ShowInstantNotifications />
              </DatesProvider>
            </MantineProvider>
          </ContactsStoreProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
