// EditCertificationModal.tsx
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { useEffect, useState } from 'react'
import { useUsers } from '../context/users-context'
import { Certification } from '../data/users'

export function EditCertificationModal() {
    const { open, setOpen, currentRow, setCurrentRow } = useUsers()
    const [certification, setCertification] = useState<Certification | null>(null)

    // Dès que la modal est ouverte et que currentRow existe, on initialise la certification
    useEffect(() => {
        if (open === 'editCertification' && currentRow) {
            setCertification(currentRow as Certification)
        }
    }, [open, currentRow])

    // Si la modal n'est pas destinée à l'édition ou que la certification n'est pas chargée, ne rien afficher
    if (open !== 'editCertification' || !certification) return null

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Ici, vous pouvez récupérer les valeurs du formulaire et effectuer les mises à jour nécessaires.
        // Par exemple, récupérer les données avec FormData ou via des refs :
        // const formData = new FormData(e.currentTarget)
        // const updatedCertification = { ...certification, tokenId: formData.get('tokenId'), ... }

        // Une fois la mise à jour effectuée, vous pouvez fermer la modal
        setOpen(null)
        setCurrentRow(null)
    }

    return (
        <Dialog open={true} onOpenChange={(openState) => {
            if (!openState) {
                setOpen(null)
                setCurrentRow(null)
            }
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier la Certification</DialogTitle>
                    <DialogDescription>
                        Modifiez les détails de la certification ci-dessous.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="tokenId" className="block text-sm font-medium">
                            Token ID
                        </label>
                        <input
                            id="tokenId"
                            name="tokenId"
                            type="text"
                            defaultValue={certification.tokenId}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="studentId" className="block text-sm font-medium">
                            Student ID
                        </label>
                        <input
                            id="studentId"
                            name="studentId"
                            type="text"
                            defaultValue={certification.studentId}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    {/* Ajoutez ici les autres champs nécessaires pour la certification */}
                    <DialogFooter>
                        <Button type="submit">Enregistrer les modifications</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
