import { useEffect } from "react";


export default function useGetBrand() {
    useEffect(() => {
        const getBrand = async () => {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/brand/get-my-brand`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            //console.log(data);
            sessionStorage.setItem('brand', JSON.stringify(data.brand));
        }
        getBrand();
    }, [])
}