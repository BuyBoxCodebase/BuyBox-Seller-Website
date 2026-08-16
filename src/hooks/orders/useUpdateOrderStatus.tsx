import { OrderStatus } from '@/features/orders/data/schema'
import { useState } from 'react'

export default function useUpdateOrderStatus() {
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const updateStatus = async (orderId: string, status: OrderStatus) => {
        setUpdatingId(orderId)
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/order/seller/update-status/${orderId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ status }),
                }
            )

            if (!response.ok) {
                const error = await response.json().catch(() => null)
                throw new Error(error?.message ?? 'Failed to update order status')
            }

            return await response.json()
        } finally {
            setUpdatingId(null)
        }
    }

    return { updateStatus, updatingId }
}
