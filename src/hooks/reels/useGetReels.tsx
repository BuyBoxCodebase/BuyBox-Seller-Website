
import { Videos } from '@/features/videos/data/schema'
import { useEffect, useState } from 'react'


export default function useGetVideos() {
  const [videos, setVideos] = useState<Videos[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getVideos = async () => {
        const token = sessionStorage.getItem("token");
        setLoading(true);
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/reels/get-seller-reels`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
    
          if (response.status === 200) {
            const data = await response.json();
            console.log('FROM GET VIDEOS:', data);
            setVideos(data);
            
          } else {
            //console.error("Error fetching products");
          }
        } catch (error) {
          //console.error("Error fetching products:", error);
          
    
        } finally {
          setLoading(false);
        }
      }

    getVideos()
  }, [])

  return { videos, loading }
}
