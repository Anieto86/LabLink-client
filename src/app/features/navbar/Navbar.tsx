import { Row } from '@/app/components/design/Grid'
import LogoutButton from '@/guest/pages/loginPage/LogOutButton'

const NavBar = () => {
  return (
    <Row className="w-full justify-end p-1 border-b border-gray-200  ">
      <LogoutButton />
    </Row>
  )
}

export default NavBar
