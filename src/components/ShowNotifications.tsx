'use client'
import { useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebaseInit'
import { notifications } from '@mantine/notifications'
import { NotificationData } from '@/lib/firebase'

const ShowNotifications = ({ userId }: { userId: string }) => {
  useEffect(() => {
    // Real-time listener for user-specific notifications
    const q = query(collection(db, 'share-notifications'), where('userId', '==', userId))
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
        })) as unknown as NotificationData[]
      data.map((nData) =>
        notifications.show({
          message: nData.message,
          title: nData.title
        })
      )
    })

    // Cleanup listener on component unmount
    return () => unsubscribe()
  }, [userId])

  return null
}

export default ShowNotifications
