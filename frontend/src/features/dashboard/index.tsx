'use client'

import { useEffect, useMemo, useState } from 'react'
import { wagmiContractConfig } from '@/abi/contract'
import { useAccount, useReadContract } from 'wagmi'
import { usePinataMetadata } from '@/hooks/pinata'
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

  // État local pour la liste des certifications récupérées via le contrat
  const [certificationList, setCertificationList] = useState<Certification[]>(
    []
  )

  // Récupération des données du contrat (tokenIds et tokenURIs)
  const {
    data: tokenIds,
    isLoading,
    error,
  } = useReadContract({
    address: wagmiContractConfig.address,
    abi: wagmiContractConfig.abi,
    functionName: 'getListNfts',
  })

  // Met à jour certificationList lorsque tokenIds change
  useEffect(() => {
    if (
      tokenIds &&
      Array.isArray(tokenIds) &&
      tokenIds.length >= 2 &&
      Array.isArray(tokenIds[0]) &&
      Array.isArray(tokenIds[1])
    ) {
      const idsArray = tokenIds[0] // Tableau contenant les tokenIds (de type bigint)
      const urisArray = tokenIds[1] // Tableau contenant les tokenURIs (de type string)
      const typesArray = tokenIds[2] // Tableau contenant les types de certification (de type string)

      // Vérifier que les deux tableaux ont la même longueur
      if (idsArray.length !== urisArray.length) {
        console.error(
          "Les tableaux tokenIds et tokenURIs n'ont pas la même longueur."
        )
        return
      }

      console.log('tokenIds', tokenIds)

      const certifications = idsArray.map((id: bigint, index: number) => ({
        tokenId: Number(id),
        owner: address || 'Unknown',
        certificationType: typesArray[index],
        tokenURI: urisArray[index],
        studentId: 2,
        parentId: undefined,
        // Vous pouvez ajouter ici certification.studentId si nécessaire
      }))

      // Met à jour l'état uniquement si la nouvelle liste est différente
      setCertificationList(certifications)
    }
  }, [tokenIds, address])

  console.log('certificationList', certificationList)

  // Mémorise le tableau des tokenURIs pour éviter qu'il ne soit recréé à chaque rendu
  const tokenURIs = useMemo(
    () => certificationList.map((certification) => certification.tokenURI),
    [certificationList]
  )

  // Récupère les métadonnées depuis Pinata uniquement si tokenURIs n'est pas vide
  const { metadataList } = usePinataMetadata(tokenURIs)

  // Fusionne les certifications avec les métadonnées Pinata
  const mergedData = useMemo(() => {
    return certificationList.map((certification, index) => {
      const metadata = metadataList[index]
      // Extraction du studentId depuis metadata.attributes (s'il existe)
      const studentIdFromMetadata = metadata?.attributes?.find(
        (attr: { trait_type: string; value: any }) =>
          attr.trait_type === 'studentId'
      )?.value

      const parentId = metadata?.attributes?.find(
        (attr: { trait_type: string; value: any }) =>
          attr.trait_type === 'parentId'
      )?.value

      return {
        ...certification,
        tokenURI: tokenURIs[index],
        // Utilise le studentId extrait si disponible, sinon la valeur déjà présente dans certification
        studentId: studentIdFromMetadata,
        parentId: parentId,
      }
    })
  }, [certificationList, metadataList, tokenURIs])

  console.log(mergedData)
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
          <UsersPrimaryButtons />
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <p>Chargement des certificats...</p>
          ) : error ? (
            <p className='text-red-500'>Erreur : {error.message}</p>
          ) : (
            <UsersTable<Certification> data={mergedData} columns={columns} />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
