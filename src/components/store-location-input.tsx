import { useState } from 'react'
import { Loader2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface Coordinates {
  latitude: number
  longitude: number
}

interface StoreLocationInputProps {
  value: Coordinates | null | undefined
  onChange: (value: Coordinates | null) => void
}

// The store's location decides which Treides hub its orders ship from.
// Sellers can use their device location or paste the numbers from Google Maps.
export function StoreLocationInput({ value, onChange }: StoreLocationInputProps) {
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState('')
  const [latitude, setLatitude] = useState(value?.latitude?.toString() ?? '')
  const [longitude, setLongitude] = useState(value?.longitude?.toString() ?? '')

  const update = (lat: string, lng: string) => {
    setLatitude(lat)
    setLongitude(lng)
    const parsedLat = parseFloat(lat)
    const parsedLng = parseFloat(lng)
    onChange(
      Number.isFinite(parsedLat) && Number.isFinite(parsedLng)
        ? { latitude: parsedLat, longitude: parsedLng }
        : null
    )
  }

  const useCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Your browser cannot share its location. Enter the numbers instead.')
      return
    }
    setIsLocating(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        update(position.coords.latitude.toFixed(6), position.coords.longitude.toFixed(6))
        setIsLocating(false)
      },
      () => {
        setError('Could not get your location. Allow location access or enter the numbers instead.')
        setIsLocating(false)
      }
    )
  }

  return (
    <div className='space-y-2'>
      <Button type='button' variant='outline' onClick={useCurrentLocation} disabled={isLocating}>
        {isLocating ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <MapPin className='mr-2 h-4 w-4' />}
        Use my current location
      </Button>
      <div className='grid grid-cols-2 gap-2'>
        <Input
          type='number'
          step='any'
          placeholder='Latitude, e.g. -17.8292'
          value={latitude}
          onChange={(e) => update(e.target.value, longitude)}
        />
        <Input
          type='number'
          step='any'
          placeholder='Longitude, e.g. 31.0522'
          value={longitude}
          onChange={(e) => update(latitude, e.target.value)}
        />
      </div>
      {error && <p className='text-[0.8rem] text-destructive'>{error}</p>}
    </div>
  )
}
