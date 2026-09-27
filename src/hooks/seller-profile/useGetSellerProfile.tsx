import { useEffect } from "react";

export default function useGetSellerProfile() {
    useEffect(() => {
        const getProfile = async () => {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/seller/profile/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                sessionStorage.setItem('seller', JSON.stringify(data.seller));
            }
        }
        getProfile();
    }, [])
}
