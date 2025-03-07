import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { Column, Row } from '@/app/components/design/Grid'
import Navbar from '@/components/app/navbar/Navbar'
import Sidebar from '@/app/layout/Sidebar'

const AuthenticatedLayout = () => {
  return (
    <Column className="w-full h-full items-center">
      <Navbar />
      <Row className="w-full h-full">
        <Sidebar />

        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </Row>
    </Column>
  )
}

export default AuthenticatedLayout
