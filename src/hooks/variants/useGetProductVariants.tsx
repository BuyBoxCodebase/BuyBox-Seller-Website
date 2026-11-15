import { useEffect, useState } from 'react'
import { Variant } from './schema'

// Only fetches while `enabled` is true (the variants dialog is open), so the product table
// doesn't fire one request per row on load. `variants` is always an array: a 404 (product
// deleted), an error body or a network failure all end up as an empty list.
export default function useGetProductVariants(
  id: string,
  refreshKey = 0,
  enabled = true
) {
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    const fetchVariants = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/product/seller/variants/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
          }
        )
        const data = response.ok ? await response.json() : null
        if (!cancelled) {
          setVariants(Array.isArray(data?.variants) ? data.variants : [])
        }
      } catch {
        if (!cancelled) setVariants([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchVariants()
    return () => {
      cancelled = true
    }
  }, [id, refreshKey, enabled])

  return { variants, loading }
}
