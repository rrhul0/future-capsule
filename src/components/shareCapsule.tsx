'use client'
import { ActionIcon, CopyButton, Tooltip } from '@mantine/core'
import { Check, Copy } from '@phosphor-icons/react'
import React from 'react'

const APP_URL = (process.env.AUTH_URL ?? 'http://localhost:3000/auth').replace(/auth\/*/, '')

const ShareCapsule = ({ id }: { id: string }) => {
  const shareLink = APP_URL + 'share-capsule-' + id
  return (
    <div>
      <span>Share to friends</span>
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
  )
}

export default ShareCapsule
