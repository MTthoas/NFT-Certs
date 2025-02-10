'use client'

import { useState } from 'react'
import { abi } from '@/abi/abi'
import { useAccount, useWriteContract } from 'wagmi'
import { contract_address } from '@/utils/config'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { userListSchema } from './data/schema'
import { users } from './data/users'

const Users = () => {
  // Parse user list
  const userList = userListSchema.parse(users)
  // Call useAccount hook to get the current account
  const { address } = useAccount()

  const [recipient, setRecipient] = useState('')
  const [diplomaData, setDiplomaData] = useState({ title: '', description: '' })

  const { data: hash, writeContract } = useWriteContract()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      writeContract({
        address: contract_address,
        abi: abi,
        functionName: 'mintDiploma',
        args: [recipient, 'url'],
      })
    } catch (err) {
      console.log(err)
      alert('Erreur lors du mint du diplôme')
    }
  }

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
          <div>
            <form
              onSubmit={handleSubmit}
              style={{ maxWidth: 400, margin: '0 auto' }}
            >
              <div>
                <label>
                  Adresse du destinataire :
                  <input
                    type='text'
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </label>
              </div>

              <div>
                <label>
                  Titre du diplôme :
                  <input
                    type='text'
                    value={diplomaData.title}
                    onChange={(e) =>
                      setDiplomaData({ ...diplomaData, title: e.target.value })
                    }
                    required
                    style={{ width: '100%' }}
                  />
                </label>
              </div>

              <div>
                <label>
                  Description :
                  <textarea
                    value={diplomaData.description}
                    onChange={(e) =>
                      setDiplomaData({
                        ...diplomaData,
                        description: e.target.value,
                      })
                    }
                    required
                    style={{ width: '100%' }}
                  />
                </label>
              </div>

              <button type='submit'>{'Mint Diploma'}</button>
            </form>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <UsersTable data={userList} columns={columns} />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}

export default Users
