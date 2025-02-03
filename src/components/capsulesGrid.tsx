'use client'
import React from 'react'
import Capsule from './capsule'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getAllCapsules } from '@/app/server-actions/capsule'

const CapsulesGrid = () => {
  const { data: capsules } = useSuspenseQuery({
    queryKey: ['capsules'],
    queryFn: () => getAllCapsules()
  })

  return (
    <div className='flex gap-3 flex-wrap'>
      {capsules.map((capsule) => (
        <Capsule capsule={capsule} key={capsule.id} />
      ))}
    </div>
  )
}

export default CapsulesGrid
