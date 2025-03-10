import { Link } from 'react-router-dom'
import { HiHome, HiLightBulb, HiUser, HiCog, HiDocumentText } from 'react-icons/hi'

const sidebarContent = [
  { text: 'Home', link: '/home', icon: <HiHome className="w-5 h-5" /> },
  { text: 'Innovation', link: '/innovation', icon: <HiLightBulb className="w-5 h-5" /> },
  { text: 'Profile', link: '/profile', icon: <HiUser className="w-5 h-5" /> },
  { text: 'Settings', link: '/settings', icon: <HiCog className="w-5 h-5" /> },
  { text: 'Forms', link: '/forms', icon: <HiDocumentText className="w-5 h-5" /> }
]

const Sidebar = () => {
  return (
    <aside className="w-16 sm:w-36 md:w-48 h-full dark:bg-[#0a0e1a] p-2 md:p-4 transition-all duration-300">
      <ul>
        {sidebarContent.map((item, index) => (
          <li key={`${index}-${item.text}`} className="mb-4">
            <Link
              to={item.link}
              className="flex items-center justify-center md:justify-start p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-gray-600 dark:text-gray-300">{item.icon}</span>
              <span className="hidden md:block ml-3">{item.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
