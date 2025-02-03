'use client'
import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { signIn } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'

const providers = ['Google', 'GitHub', 'GitLab']

const ConnectAnotherAccount = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  return (
    <div>
      {searchParams.get('added') && <div>Successfully added {searchParams.get('added')}</div>}
      <button onClick={open}>Connect another email/account</button>
      <Modal title={'Connect another email/account'} opened={opened} onClose={close}>
        <div>
          {providers.map((provider) => (
            <div key={provider}>
              <button
                onClick={() =>
                  signIn(provider.toLowerCase(), { redirectTo: pathname + '?added=' + provider.toLowerCase() })
                }
              >
                {provider}
              </button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default ConnectAnotherAccount
