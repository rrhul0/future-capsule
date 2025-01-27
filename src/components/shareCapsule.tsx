'use client'
import { changeSharingAccess } from '@/app/server-actions/capsule'
import { ActionIcon, Button, CopyButton, Modal, Select, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Check, Copy } from '@phosphor-icons/react'
import { CapsuleSharingAccess } from '@prisma/client'
import React from 'react'
import SelectUsersToShare from './selectUsersToShare'

const APP_URL = (process.env.AUTH_URL ?? 'http://localhost:3000/auth').replace(/auth\/*/, '')

const ShareCapsule = ({ id, sharingAccess }: { id: string; sharingAccess: CapsuleSharingAccess }) => {
  const [opened, { open, close }] = useDisclosure(false)

  const shareLink = APP_URL + 'share-capsule-' + id

  const onChangeAccess = (value: string | null) => {
    if (value) changeSharingAccess(id, value as CapsuleSharingAccess)
  }

  return (
    <div>
      <Button onClick={open}>Share to friends</Button>
      <Modal title='Share Capsule' opened={opened} onClose={close}>
        <div>
          <div>Who have access to this</div>
          <Select
            data={[
              { value: 'NO_ONE', label: 'Only me' },
              { value: 'SPECIFIC_USERS', label: 'Only selected users' },
              { value: 'ANYONE_WITH_LINK', label: 'Anyone with the link' }
            ]}
            defaultValue={sharingAccess}
            onChange={onChangeAccess}
          />
          <SelectUsersToShare />
          <div className='flex gap-2 border border-gray-300 rounded-md py-0.5 px-2 bg-slate-600'>
            <div>{shareLink}</div>
            <CopyButton value={shareLink} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position='right'>
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant='subtle' onClick={copy}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ShareCapsule
