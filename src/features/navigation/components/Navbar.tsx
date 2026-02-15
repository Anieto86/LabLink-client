import { Row } from '@/shared/ui/design/Grid'
import LogoutButton from '@/features/auth/components/LogoutButton'

const Navbar = () => {
  return (
    <Row className="w-full justify-end p-1 border-b border-gray-200  ">
      <LogoutButton />
    </Row>
  )
}

export default Navbar

