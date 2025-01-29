'use client'
import { NotificationType } from '@/lib/firebase'
import { db } from '@/lib/firebaseInit'
import { Popover } from '@mantine/core'
import { query, collection, where, onSnapshot } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

const AllNotifications = () => {
  const session = useSession()
  const userId = session.data?.user?.id
  const [notifications, setNotifications] = React.useState<NotificationType[]>([])

  useEffect(() => {
    if (!userId) return
    // Real-time listener for user-specific notifications
    const q = query(collection(db, 'share-notifications'), where('userId', '==', userId))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docChanges().map((change) => ({
        id: change.doc.id,
        ...change.doc.data()
      })) as unknown as NotificationType[]
      console.log(data)
      setNotifications(data)
    })

    // Cleanup listener on component unmount
    return () => unsubscribe()
  }, [userId])

  if (!session || !session.data || !session.data.user) return null

  return (
    <Popover
      width='400'
      withArrow
      position='bottom'
      styles={{
        dropdown: {
          padding: 0
        }
      }}
    >
      <Popover.Target>
        <div className='w-fit'>Notifications</div>
      </Popover.Target>
      <Popover.Dropdown>
        <div className=''>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={
                (notification.isRead ? '' : 'bg-gray-800') +
                ' px-4 py-3 flex items-center gap-3 border-b last:border-b-0 border-gray-400'
              }
            >
              <div
                className={
                  (notification.isRead ? 'opacity-0' : 'opacity-100') + ' w-3 h-3 rounded-full bg-blue-600 shrink-0'
                }
              />
              <div>
                <h3 className='font-bold text-lg'>{notification.title}</h3>
                <p className=''>{notification.message}</p>
              </div>
            </div>
          ))}
        </div>
      </Popover.Dropdown>
    </Popover>
  )
}

export default AllNotifications
