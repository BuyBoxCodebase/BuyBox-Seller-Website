import { IconDownload, IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useProduct } from '../context/products-context'

export function ProductsPrimaryButtons() {
  const { setOpen } = useProduct()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import</span> <IconDownload size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen("create-product")}>
        <span>Create</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
