import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { Certification } from '../data/users'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Certification>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'tokenId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Id' />
    ),
    cell: ({ row }) => <div>{row.getValue('tokenId')}</div>,
    meta: {
      className: cn(
        'sticky left-6 md:table-cell',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'studentId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Student ID' />
    ),
    cell: ({ row }) => <div>{row.getValue('studentId')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'owner',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Owner' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('owner')}</LongText>
    ),
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'certificationType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline' className='capitalize'>
        {row.getValue('certificationType')}
      </Badge>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'tokenURI',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Metadata URI' />
    ),
    cell: ({ row }) => (
      <a
        href={row.getValue('tokenURI')}
        target='_blank'
        rel='noopener noreferrer'
        className='text-blue-500 underline'
      >
        View Metadata
      </a>
    ),
  },
  {
    accessorKey: 'parentId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Parent Diploma ID' />
    ),
    cell: ({ row }) =>
      row.original.certificationType === 'Performance'
        ? row.getValue('parentId')
        : '-',
    enableSorting: true,
  },
  {
    accessorKey: 'Performance',
    cell: DataTableRowActions,
  },
]
