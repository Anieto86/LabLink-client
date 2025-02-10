import { Outlet } from 'react-router-dom'
import { Column } from '../design/Grid'
import Navbar from './navbar/Navbar'
import Sidebar from '@/components/app/sidebar/Sidebar'

const AuthenticatedLayout = () => {
  return (
    <Column className="w-full h-full items-center">
      <Navbar />
      <Sidebar />

      <main>
        <Outlet />
      </main>
    </Column>
  )
}

export default AuthenticatedLayout
