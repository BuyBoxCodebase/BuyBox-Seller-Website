
import { useEffect, useState } from 'react'

interface Category {
  id: string
  name: string
  imageUrl: string
  categoryId?:string,
  subCategories?: Category[]
}

export default function useGetAllCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        // console.log('here')
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/category/get`,
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

  return { categories, loading }
}
