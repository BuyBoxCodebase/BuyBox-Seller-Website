import { IconDownload, IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useCategory } from '../context/tasks-context'

export function TasksPrimaryButtons() {
  const { setOpen } = useCategory()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import</span> <IconDownload size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('create-category')}>
        <span>Create</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
