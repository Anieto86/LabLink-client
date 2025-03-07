import { Column } from '@/app/components/design/Grid'
import { Outlet } from 'react-router-dom'

const GuestLayout = () => {
  return (
    <Column className="w-full h-full items-center">
      <main>
        <Outlet />
      </main>
    </Column>
  )
}

export default GuestLayout
