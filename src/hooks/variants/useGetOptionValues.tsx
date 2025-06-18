
import { useEffect, useState } from 'react'
import { Options } from './schema'



export default function useGetOptionValues(id: string) {
  const [options, setOptions] = useState<Options[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async (id:string) => {
      setLoading(true)
      try {
        // console.log('here')
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/product/option/${id}`,
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
        setOptions(data)
      } catch (err) {
        //console.error('Error fetching products:', err)
        setOptions([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories(id)
  }, [])

  return { options, loading }
}
