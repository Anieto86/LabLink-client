// LogoutButton.tsx
import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

interface LogoutButtonProps {
  className?: string
}

const LogoutButton = ({ className }: LogoutButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  // const { logout } = useAuth()
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsLoading(true)

    try {
      // Call the logout function from your AuthContext
      logout()

      // Navigate to login page after logout
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors ${className} cursor-pointer z-10`}
      aria-label="Logout"
    >
      {isLoading ? <span className="animate-spin h-4 w-4 border-t-2 border-gray-500 rounded-full" /> : <LogOut className="h-4 w-4" />}
      <span>Logout</span>
    </button>
  )
}

export default LogoutButton
