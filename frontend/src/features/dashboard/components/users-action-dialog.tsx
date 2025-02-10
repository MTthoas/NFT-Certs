'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { wagmiContractConfig } from '@/abi/contract'
import { Address } from 'viem'
import { useWriteContract } from 'wagmi'
import { uploadJson } from '@/hooks/pinata'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SelectDropdown } from '@/components/select-dropdown'
import { degreesStatus, degreesTypes } from '../data/data'
import { User } from '../data/schema'

const formSchema = z.object({
  address: z.string().min(1, { message: 'First Name is required.' }),
  studentId: z.string().min(1, { message: 'Student Id is required.' }),
  program: z.string().min(1, { message: 'Program is required.' }),
  programStatus: z.string().min(1, { message: 'Program Status is required.' }),
  isEdit: z.boolean(),
})
type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          isEdit,
        }
      : {
          address: '',
          studentId: '',
          program: '',
          programStatus: '',
          isEdit,
        },
  })

  const { data: hash, writeContract } = useWriteContract()

  const onSubmit = async (values: UserForm) => {
    try {
      const hash = await uploadJson({
        name: 'diploma.json',
        description: 'Diploma',
        image:
          'https://static1.squarespace.com/static/5fa175aaf96cad0532ce2969/6148561302b5d728b97e0788/614860d0577319490167b0c9/1706281940014/ESGI.png?format=1500w',
        data: {
          address: values.address,
          studentId: values.studentId,
          program: values.program,
          programStatus: values.programStatus,
          issuer: 'ESGI',
          academicProgress: [],
        },
      })

      const url = `https://bronze-wonderful-centipede-191.mypinata.cloud/ipfs/${hash}`
      console.log(url)

      writeContract({
        address: wagmiContractConfig.address,
        abi: wagmiContractConfig.abi,
        functionName: 'mintDiploma',
        args: [values.address as Address, url, values.studentId],
      })
    } catch (err) {
      console.log(err)
      alert('Erreur lors du mint du diplôme')
    }

    form.reset()
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {isEdit ? 'Edit Certification' : 'Add New Certification'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the certification here. '
              : 'Create new certification here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='-mr-4 h-[26.25rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='0x343...'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='studentId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Student ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Student Id'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='program'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Program
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a program'
                      className='col-span-4'
                      items={degreesTypes.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='programStatus'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Program Status
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a program status'
                      className='col-span-4'
                      items={degreesStatus.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button type='submit' form='user-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
