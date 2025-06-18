import { Product } from '@/features/products/data/schema'
import { useEffect, useState } from 'react'


export default function useGetProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProducts = async () => {
        //const token = localStorage.getItem("token");
        //const user = JSON.parse(sessionStorage.getItem("user") || '{}');
        setLoading(true);
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/product/get-seller-products`,
            // `${baseUrl}/product/store?storeName=${storename}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
            }
          );
          
    
          if (response.status === 200) {
            const data = await response.json();
            //console.log('FROM GET PRODUCTS:', data);
            setProducts(data.products);
    
            //console.log(products);
            // setTotalPages(Math.ceil(data.total / rowsPerPage));
            
          } else {
            //console.error("Error fetching products");
          }
        } catch (error) {
          //console.error("Error fetching products:", error);
          
    
        } finally {
          setLoading(false);
        }
      }

    getProducts()
  }, [])

  return { products, loading }
}
