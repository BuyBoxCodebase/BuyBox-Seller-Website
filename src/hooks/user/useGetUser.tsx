
import { useEffect, useState } from 'react'
import { User } from './schema'

export default function useGetAllUser() {
  const [users, setUsers] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        // console.log('here')
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/seller/profile/get-details`,
          {
            credentials: 'include',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        const data = await response.json()
        //console.log(data.seller)
        setUsers(data.seller)
      } catch (err) {
        //console.error('Error fetching products:', err)
        setUsers(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return { users, loading }
}
