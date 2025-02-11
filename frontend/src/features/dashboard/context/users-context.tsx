import useDialogState from '@/hooks/use-dialog-state'
import React, { useState } from 'react'
import { User } from '../data/schema'
import { Certification } from '../data/users'

type Entity = User | Certification

type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete' | 'editCertification' | 'revokeCertification'

interface UsersContextType {
    open: UsersDialogType | null
    setOpen: (str: UsersDialogType | null) => void
    currentRow: Entity | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Entity | null>>
}

const UsersContext = React.createContext<UsersContextType | null>(null)

interface Props {
    children: React.ReactNode
}

export default function UsersProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<UsersDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Entity | null>(null)

    return (
        <UsersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </UsersContext.Provider>
    )
}

export const useUsers = () => {
    const usersContext = React.useContext(UsersContext)

    if (!usersContext) {
        throw new Error('useUsers has to be used within <UsersProvider>')
    }

    return usersContext
}
