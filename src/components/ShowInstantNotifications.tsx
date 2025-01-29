'use client'
import { useEffect } from 'react'
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebaseInit'
import { notifications } from '@mantine/notifications'
import { NotificationType } from '@/lib/firebase'
import { useSession } from 'next-auth/react'
import { SHARING_NOTIFICATION_COLLECTION } from '@/utils/contants'

const ShowInstantNotifications = () => {
  const session = useSession()
  const userId = session.data?.user?.id ?? ''

  useEffect(() => {
    // Real-time listener for user-specific notifications
    const q = query(collection(db, SHARING_NOTIFICATION_COLLECTION), where('userId', '==', userId))
    let isInitialLoad = true
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (isInitialLoad) {
        isInitialLoad = false
        return
      }
      const data = querySnapshot
        .docChanges()
        // only show newly shared capsules notification
        .filter((change) => change.type === 'added')
        .map((change) => ({
          id: change.doc.id,
          ...change.doc.data()
        })) as unknown as NotificationType[]
      data.map((nData) =>
        notifications.show({
          message: nData.message,
          title: nData.title,
          onClose: async () => {
            // Set isRead to true for the notification
            await updateDoc(doc(db, SHARING_NOTIFICATION_COLLECTION, nData.id), {
              ...nData,
              isRead: true,
              readAt: Date.now()
            })
          }
        })
      )
    })

    // Cleanup listener on component unmount
    return () => unsubscribe()
  }, [userId])

  return null
}

export default ShowInstantNotifications
