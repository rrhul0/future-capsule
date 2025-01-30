'use client'
import React, { use } from 'react'
import Capsule, { CapsuleData } from './capsule'

const CapsulesGrid = ({ capsulesPromise }: { capsulesPromise: Promise<CapsuleData[]> }) => {
  const capsules = use(capsulesPromise)

  return (
    <div className='flex gap-3 flex-wrap'>
      {capsules.map((capsule) => (
        <Capsule capsule={capsule} key={capsule.id} />
      ))}
    </div>
  )
}

export default CapsulesGrid
