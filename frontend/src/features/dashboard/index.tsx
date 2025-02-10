'use client'

import { useEffect, useState } from 'react'
import { wagmiContractConfig } from '@/abi/contract'
import { useAccount, useReadContract } from 'wagmi'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { Certification } from './data/users'

export default function Certifications() {
  const { address } = useAccount()
  const [certificationList, setCertificationList] = useState<Certification[]>(
    []
  )
  const {
    data: tokenIds,
    isLoading,
    error,
  } = useReadContract({
    address: wagmiContractConfig.address,
    abi: wagmiContractConfig.abi,
    functionName: 'listNFTs',
  })

  useEffect(() => {
    if (tokenIds && Array.isArray(tokenIds)) {
      const certifications = tokenIds.map((id: bigint) => ({
        tokenId: Number(id),
        owner: address || 'Unknown',
        certificationType: 'Diploma' as 'Diploma',
        tokenURI: '',
        parentDiplomaId: undefined,
      }))
      setCertificationList(certifications)
    }
  }, [tokenIds, address])

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          {/* @ts-expect-error msg */}
          <appkit-button />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Certification List
          </h2>
          <p className='text-muted-foreground'>
            Manage the certifications and their types here.
          </p>
          {/* </div>  */}
          <UsersPrimaryButtons />
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <p>Chargement des certificats...</p>
          ) : error ? (
            <p className='text-red-500'>Erreur : {error.message}</p>
          ) : (
            <UsersTable<Certification>
              data={certificationList}
              columns={columns}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
