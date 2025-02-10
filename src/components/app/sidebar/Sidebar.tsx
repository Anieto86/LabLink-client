import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="w-64 h-full bg-gray-900 text-white p-4 fixed left-0 top-0">
      <ul>
        <li className="mb-4">
          <Link to="/dashboard" className="text-white hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/profile" className="text-white hover:underline">
            Profile
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/settings" className="text-white hover:underline">
            Settings
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
