'use client'

import { wagmiContractConfig } from '@/abi/contract'
import { SelectDropdown } from '@/components/select-dropdown'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getPinataMetadata, uploadJson2 } from '@/hooks/pinata'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useWriteContract } from 'wagmi'
import { degreesYears } from '../data/data'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: any
}

export function AcademicProgressDialog({ open, onOpenChange, data }: Props) {
  // Initialisation du formulaire avec react-hook-form
  const methods = useForm()

  // Les états pour gérer les valeurs du formulaire (ou vous pouvez utiliser react-hook-form pour gérer les champs)
  const [studentId, setStudentId] = useState('')
  const [year, setYear] = useState('')
  const [nftId, setNftId] = useState('')
  const [ipfsCid, setIpfsCid] = useState('')
  const [program, setProgram] = useState('')
  const [comments, setComments] = useState('')

  const { writeContract } = useWriteContract()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const pinata = await getPinataMetadata(data?.tokenURI)

      // Récupération des données actuelles
      const existingAttributes = pinata?.attributes || []

      // Extraction de l'academicProgress existant
      let academicProgress =
        existingAttributes.find(
          (attr: any) => attr.trait_type === 'academicProgress'
        )?.value || []

      // Nouvelle entrée académique
      const newEntry = {
        studentId: data.studentId,
        year: year,
        nftId: data?.tokenId,
        ipfsCid: ipfsCid,
      }

      // Ajout et tri par année
      academicProgress.push(newEntry)

      //   console.log('🚀 Uploading updated metadata to Pinata...', updatedMetadata)
      const hash = await uploadJson2(
        academicProgress,
        data.owner,
        data.studentId,
        data.tokenId,
        data.program,
        data.programStatus,
        data?.tokenId,
        comments,
        pinata
      )

      if (!hash) {
        console.error('❌ Upload to Pinata failed.')
        return
      }

      //   console.log('✅ Uploaded to IPFS:', hash)

      const url = `https://bronze-wonderful-centipede-191.mypinata.cloud/ipfs/${hash}`

      writeContract({
        address: wagmiContractConfig.address,
        abi: wagmiContractConfig.abi,
        functionName: 'mintPerformance',
        args: [data.owner, data.tokenId, url],
      })

      // Reset des valeurs du formulaire
      setYear('')
      setIpfsCid('')
      setTimeout(() => onOpenChange(false), 100)
    } catch (err) {
      console.error('❌ Error while adding academic progress:', err)
      alert('Error while adding academic progress')
    }
  }

  return (
    <FormProvider {...methods}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader className='text-left'>
            <DialogTitle>
              Add Academic Progress - NFT: {String(data?.tokenId)}
            </DialogTitle>
            <DialogDescription>
              Fill the form to add an academic progress entry.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className='-mr-4 h-[26.25rem] w-full py-1 pr-4'>
            <form onSubmit={handleSubmit} className='space-y-4 p-0.5'>
              <div className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                <label className='col-span-2 text-right'>Student ID</label>
                <Input
                  value={data?.studentId || studentId}
                  //   onChange={(e) => setStudentId(e.target.value)}
                  placeholder={data?.studentId || 'Student ID'}
                  className='col-span-4'
                  disabled
                />
              </div>

              <div className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                <label className='col-span-2 text-right'>NFT ID</label>
                <Input
                  value={data?.parentDiplomaId || data?.tokenId || nftId}
                  //   onChange={(e) => setNftId(e.target.value)}
                  placeholder='Parent ID'
                  className='col-span-4'
                  disabled
                />
              </div>

              <div className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                <label className='col-span-2 text-right'>Year</label>
                <SelectDropdown
                  defaultValue={year}
                  onValueChange={setYear}
                  placeholder='Select year'
                  className='col-span-4'
                  items={degreesYears.map(({ label, value }) => ({
                    label,
                    value,
                  }))}
                />
              </div>

              <div className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                <label className='col-span-2 text-right'>IPFS CID</label>
                <Input
                  value={ipfsCid}
                  onChange={(e) => setIpfsCid(e.target.value)}
                  placeholder='IPFS Link'
                  className='col-span-4'
                />
              </div>

              <Button type='submit' className='mt-4 w-full'>
                Save Academic Progress
              </Button>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
