'use client'
import { useDisclosure } from '@mantine/hooks'
import { Button } from '@mantine/core'
import { Plus } from '@phosphor-icons/react'
import CreateCapsuleModal from './createCapsuleModal'

function CreateCapsule() {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <CreateCapsuleModal opened={opened} close={close} />
      <Button variant='default' onClick={open}>
        Capsule <Plus size={32} />
      </Button>
    </>
  )
}

export default CreateCapsule
