import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  // Vérifie si les colonnes existent avant d'y accéder
  const tokenId = table.getColumn('tokenId')
  const studentId = table.getColumn('studentId')
  const owner = table.getColumn('owner')
  const certificationType = table.getColumn('certificationType')
  const parentId = table.getColumn('parentId')

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {/* Vérification pour éviter l'erreur si la colonne 'name' n'existe pas */}

        {tokenId && (
          <Input
            placeholder='Filter ID...'
            value={(tokenId.getFilterValue() as string) ?? ''}
            onChange={(event) => tokenId.setFilterValue(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}

        {studentId && (
          <Input
            placeholder='Filter studentId...'
            value={(studentId.getFilterValue() as string) ?? ''}
            onChange={(event) => studentId.setFilterValue(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}

        {owner && (
          <Input
            placeholder='Filter owner...'
            value={(owner.getFilterValue() as string) ?? ''}
            onChange={(event) => owner.setFilterValue(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}

        <div className='flex gap-x-2'>
          {/* Vérification pour éviter l'erreur si la colonne 'status' n'existe pas */}
          {certificationType && (
            <DataTableFacetedFilter
              column={certificationType}
              title='Type'
              options={[
                { value: 'Diploma', label: 'Diploma' },
                { value: 'Performance', label: 'Performance' },
              ]}
            />
          )}

          {parentId && (
            <DataTableFacetedFilter
              column={parentId}
              title='Parent ID'
              options={[
                { value: '1', label: '1' },
                { value: '2', label: '2' },
              ]}
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
