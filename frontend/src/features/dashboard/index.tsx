'use client'

import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { certifications } from './data/certifications'
import { Certification, certificationListSchema } from './data/users'

export default function Certifications() {
  // Parse la liste des certifications
  const certificationList = certificationListSchema.parse(certifications)

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
          <UsersTable<Certification>
            data={certificationList}
            columns={columns}
          />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
