import { Outlet } from 'react-router-dom'
import { Column } from '../design/Grid'
import Navbar from './navbar/Navbar'
import Sidebar from '@/components/app/sidebar/Sidebar'
import { Suspense } from 'react'

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
