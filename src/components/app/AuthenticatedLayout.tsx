import { Outlet } from 'react-router-dom'
import { Column } from '../design/Grid'
import Sidebar from '@/components/app/layout/Sidebar'
import { Suspense } from 'react'

const AuthenticatedLayout = () => {
  return (
    <Column className="w-full h-full items-center">
      <Sidebar />
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </Column>
  )
}

export default AuthenticatedLayout
