
import { useEffect, useState } from 'react'
import {  Variant } from './schema'



export default function useGetProductVariants(id: string) {
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async (id:string) => {
      setLoading(true)
      try {
        // console.log('here')
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/product/variants/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
          }
        )
        const data = await response.json()
        // console.log(data)
        setVariants(data.variants)
      } catch (err) {
        //console.error('Error fetching products:', err)
        setVariants([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories(id)
  }, [])

  return { variants, loading }
}
