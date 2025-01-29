'use client'
import { deleteOneNotification, NotificationType } from '@/lib/firebase'
import { db } from '@/lib/firebaseInit'
import { Button, Popover } from '@mantine/core'
import { query, collection, where, onSnapshot } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import NotificationCard from './NotificationCard'
import { SHARING_NOTIFICATION_COLLECTION } from '@/utils/contants'

const AllNotifications = () => {
  const session = useSession()
  const userId = session.data?.user?.id ?? ''
  const [notifications, setNotifications] = React.useState<NotificationType[]>([])

  useEffect(() => {
    // Real-time listener for user-specific notifications
    const q = query(collection(db, SHARING_NOTIFICATION_COLLECTION), where('userId', '==', userId))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().map((change) => {
        if (change.type === 'added') {
          setNotifications((prev) => [
            {
              id: change.doc.id,
              ...change.doc.data()
            } as NotificationType,
            ...prev
          ])
        } else if (change.type === 'modified') {
          setTimeout(() => {
            setNotifications((prev) => {
              return prev.map((notif) =>
                notif.id === change.doc.id ? ({ id: change.doc.id, ...change.doc.data() } as NotificationType) : notif
              )
            })
          }, 2000)
        } else if (change.type === 'removed') {
          setNotifications((prev) => {
            return prev.filter((notif) => notif.id !== change.doc.id)
          })
        }
      })
    })

    // Cleanup listener on component unmount
    return () => unsubscribe()
  }, [userId])

  const onClickClearAll = () => {
    notifications.forEach(deleteOneNotification)
  }

  if (!session || !session.data || !session.data.user) return null

  return (
    <Popover
      width='500'
      withArrow
      position='bottom'
      withOverlay
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
        <div>
          <div id='notifications-root' className='overflow-y-scroll h-[100%] max-h-[75vh]'>
            {notifications.map((notification) => (
              <NotificationCard notification={notification} key={notification.id} />
            ))}
          </div>
          <Button onClick={onClickClearAll}>Clear all</Button>
        </div>
      </Popover.Dropdown>
    </Popover>
  )
}

export default AllNotifications
