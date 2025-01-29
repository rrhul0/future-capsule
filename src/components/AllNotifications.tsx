'use client'
import { NotificationType } from '@/lib/firebase'
import { db } from '@/lib/firebaseInit'
import { getNotificationTimeString } from '@/utils/timeDate'
import { Popover } from '@mantine/core'
import { query, collection, where, onSnapshot } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

const AllNotifications = () => {
  const session = useSession()
  const userId = session.data?.user?.id
  const [notifications, setNotifications] = React.useState<NotificationType[]>([])

  useEffect(() => {
    // Real-time listener for user-specific notifications
    const q = query(collection(db, 'share-notifications'), where('userId', '==', userId))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newNotifications = querySnapshot
        .docChanges()
        .filter((change) => change.type === 'added')
        .map((change) => {
          console.log(change)
          return {
            id: change.doc.id,
            ...change.doc.data()
          }
        }) as unknown as NotificationType[]
      setNotifications((prevNotifications) =>
        [...newNotifications, ...prevNotifications].sort((a, b) => b.createdAt - a.createdAt)
      )
    })

    // Cleanup listener on component unmount
    return () => unsubscribe()
  }, [userId])

  if (!session || !session.data || !session.data.user) return null

  return (
    <Popover
      width='500'
      withArrow
      position='bottom'
      withOverlay
      styles={{
        dropdown: {
          padding: 0,
          maxHeight: '75vh',
          overflowY: 'scroll'
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
                <span className='text-sm font-light'>{getNotificationTimeString(notification)}</span>
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
