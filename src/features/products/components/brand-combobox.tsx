import { useState } from 'react'
import { CheckIcon, ChevronDownIcon, PlusIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { BRANDS } from '../data/brands'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function BrandCombobox({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const custom = search.trim()
  const isListed = BRANDS.some(b => b.toLowerCase() === custom.toLowerCase())

  const select = (brand: string) => {
    onChange(brand)
    setSearch('')
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-full justify-between font-normal', !value && 'text-muted-foreground')}
        >
          {value || 'Select a brand'}
          <ChevronDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search or type a brand...' value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>No brands found.</CommandEmpty>
            {custom && !isListed && (
              <CommandGroup>
                <CommandItem value={`__custom__${custom}`} onSelect={() => select(custom)}>
                  <PlusIcon className='mr-2 h-4 w-4' />
                  Use &quot;{custom}&quot;
                </CommandItem>
              </CommandGroup>
            )}
            <CommandGroup>
              {BRANDS.map(brand => (
                <CommandItem key={brand} value={brand} onSelect={() => select(brand)}>
                  <CheckIcon className={cn('mr-2 h-4 w-4', value === brand ? 'opacity-100' : 'opacity-0')} />
                  {brand}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
