import { Outlet } from 'react-router-dom'

import { Suspense } from 'react'
import { Column } from './components/design/Grid'
import Sidebar from './layout/Sidebar'

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
