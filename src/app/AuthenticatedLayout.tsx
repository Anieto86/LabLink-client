import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { Column } from '@/app/components/design/Grid'
import Navbar from '@/components/app/navbar/Navbar'
import Sidebar from '@/app/layout/Sidebar'

const AuthenticatedLayout = () => {
  return (
    <Column className="w-full h-full items-center">
      <Navbar />
      <Sidebar />

      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </Column>
  )
}

export default AuthenticatedLayout
