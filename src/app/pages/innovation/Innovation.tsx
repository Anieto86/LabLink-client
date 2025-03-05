import { Button } from '@/app/components/design/Button'
import { Column } from '@/app/components/design/Grid'
import { useNavigate } from 'react-router-dom'

const Innovation = () => {
  const navigate = useNavigate()

  return (
    <Column className="items-center justify-center min-h-screen p-6">
      <Button className="px-6 py-3 text-lg" onClick={() => navigate('/brainstorming')}>
        Start a Brainstorming Session
      </Button>
    </Column>
  )
}

export default Innovation
