import { Outlet } from 'react-router-dom'
import { Column } from '@/components/design/Grid'
import GuestNavBar from '@/components/guest/guestNavBar/GuestNavBar'

const GuestLayout = () => {
  return (
    <Column className="w-full h-full items-center">
      <GuestNavBar />
      <main>
        <Outlet />
      </main>
    </Column>
  )
}

export default GuestLayout
