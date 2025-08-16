import { Analytics } from '@/features/dashboard/data/schema'
import { useEffect, useState } from 'react'

export default function useGetAnalytics() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true)
            try {
                // console.log('here')
                const response = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/analytics/seller`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        },
                    }
                )
                const data = await response.json()
                setAnalytics(data)
            } catch (err) {
                //console.error('Error fetching products:', err)
                setAnalytics(null)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return { analytics, loading }
}
