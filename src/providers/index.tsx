import { auth } from '@/auth'
import { ContactType } from '@/store/contacts'
import { createTheme, MantineProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { prisma } from '@prisma-client'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'
import { ContactsStoreProvider } from './contactsProvider'

const theme = createTheme({
  /** Put your mantine theme override here */
})

const Providers = async ({ children }: { children: ReactNode }) => {
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
    <SessionProvider session={session} basePath='/auth'>
      <ContactsStoreProvider contacts={userData?.Contacts ?? []}>
        <MantineProvider theme={theme} defaultColorScheme='auto'>
          <DatesProvider settings={{ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }}>
            {children}
          </DatesProvider>
        </MantineProvider>
      </ContactsStoreProvider>
    </SessionProvider>
  )
}

export default Providers
