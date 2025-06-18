
import { SubCategory } from '@/features/subcategories/data/schema'
import { useEffect, useState } from 'react'

export default function useGetAllSubCategories() {
  const [subCategories, setCategories] = useState<SubCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        // console.log('here')
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/category/get/sub-categories`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        const data = await response.json()
       // console.log(data)
        setCategories(data)
      } catch (err) {
        //console.error('Error fetching products:', err)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { subCategories, loading }
}
