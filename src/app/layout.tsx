import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ColorSchemeScript } from '@mantine/core'
import Head from 'next/head'
import { createTheme, MantineProvider } from '@mantine/core'

import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import { DatesProvider } from '@mantine/dates'

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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <Head>
        <ColorSchemeScript />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MantineProvider theme={theme} defaultColorScheme='auto'>
          <DatesProvider settings={{ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }}>
            {children}
          </DatesProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
