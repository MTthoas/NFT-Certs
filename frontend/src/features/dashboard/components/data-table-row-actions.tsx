import { Button } from '@/components/ui/button'
import { IconPlus } from '@tabler/icons-react'
import { Row } from '@tanstack/react-table'
import { useUsers } from '../context/users-context'
import { Certification } from '../data/users'

interface DataTableRowActionsProps {
    row: Row<Certification>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useUsers()

    const handleClick = () => {
        console.log(row) // affiche l'objet row complet
        console.log(row.original) // affiche les données de la ligne

        // Par exemple, on peut stocker les données de la ligne dans le contexte
        setCurrentRow(row.original)
        setOpen('editCertification')
    }

    return (
        <Button className='space-x-1' onClick={handleClick}>
            <span> Add a performance </span> <IconPlus size={18} />
        </Button>
    )
}
