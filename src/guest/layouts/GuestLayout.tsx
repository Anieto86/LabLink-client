import { Outlet } from 'react-router-dom'
import { Column } from '@/components/design/Grid'

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
