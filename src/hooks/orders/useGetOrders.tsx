import { Order } from '@/features/orders/data/schema'
import { useEffect, useState } from 'react'

export default function useGetAllOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true)
            try {
                // console.log('here')
                const response = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/order/seller/get-orders`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        },
                    }
                )
                const data = await response.json()
                setOrders(data)
            } catch (err) {
                //console.error('Error fetching products:', err)
                setOrders([])
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return { orders, loading }
}
