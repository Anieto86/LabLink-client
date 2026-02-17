import { Row } from '@/shared/ui/design/Grid'
import { Button } from '@/shared/ui/design/Button'
import { useAuthSession } from '@/features/auth/state/AuthSessionProvider'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { user, logout } = useAuthSession()
  const navigate = useNavigate()

  return (
    <Row className="w-full items-center justify-between p-3 border-b border-gray-200 gap-2">
      <h1 className="text-lg font-semibold">LabLink</h1>
      <Row className="items-center gap-2">
        <span className="text-sm text-gray-600">{user?.email || 'Session active'}</span>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            logout()
            navigate('/login', { replace: true })
          }}
        >
          Logout
        </Button>
      </Row>
    </Row>
  )
}

export default Navbar

