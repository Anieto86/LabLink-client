import { Outlet } from 'react-router-dom'
import { Column } from '@/app/components/design/Grid'
import GuestNavBar from '@/guest/guestNavBar/GuestNavBar'

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
