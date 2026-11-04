import { useEffect, useMemo } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './product-data-table-view-options'
import { priorities, statuses } from '../data/data'
import { Product } from '../data/schema'
import { DataTableFacetedFilter } from './product-data-table-faceted-filter'

interface DataTableToolbarProps<TData extends Product> {
  table: Table<TData>
}

const toOptions = (names: (string | undefined)[]) =>
  Array.from(new Set(names.filter((name): name is string => !!name)))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ label: name, value: name }))

export function DataTableToolbar<TData extends Product>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const categoryColumn = table.getColumn('category')
  const subCategoryColumn = table.getColumn('subCategory')
  const selectedCategories = categoryColumn?.getFilterValue() as
    | string[]
    | undefined
  const products = table.getCoreRowModel().rows

  const categoryOptions = useMemo(
    () => toOptions(products.map((row) => row.original.category?.name)),
    [products]
  )

  // Only offer subcategories that belong to the selected categories
  const subCategoryOptions = useMemo(
    () =>
      toOptions(
        products
          .filter(
            (row) =>
              !selectedCategories ||
              selectedCategories.includes(row.original.category?.name ?? '')
          )
          .map((row) => row.original.subCategory?.name)
      ),
    [products, selectedCategories]
  )

  // Drop selected subcategories that the category change just ruled out
  useEffect(() => {
    const selected = subCategoryColumn?.getFilterValue() as string[] | undefined
    if (!selected) return
    const stillOffered = selected.filter((name) =>
      subCategoryOptions.some((option) => option.value === name)
    )
    if (stillOffered.length !== selected.length) {
      subCategoryColumn?.setFilterValue(
        stillOffered.length ? stillOffered : undefined
      )
    }
  }, [subCategoryColumn, subCategoryOptions])

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter products...'
          value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('id')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {categoryColumn && (
            <DataTableFacetedFilter
              column={categoryColumn}
              title='Category'
              options={categoryOptions}
            />
          )}
          {subCategoryColumn && (
            <DataTableFacetedFilter
              column={subCategoryColumn}
              title='Subcategory'
              options={subCategoryOptions}
            />
          )}
          {table.getColumn('name') && (
            <DataTableFacetedFilter
              column={table.getColumn('name')}
              title='Name'
              options={statuses}
            />
          )}
          {table.getColumn('images') && (
            <DataTableFacetedFilter
              column={table.getColumn('images')}
              title='Image URL'
              options={priorities}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}