import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="w-48 h-full bg-[#fafafa] dark:bg-[#0a0e1a] p-4 fixed left-0 top-0">
      <ul>
        <li className="mb-4">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/profile" className=" hover:underline">
            Profile
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/settings" className=" hover:underline">
            Settings
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
