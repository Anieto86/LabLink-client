import { Link } from 'react-router-dom'

const sidebarContent = [
  { text: 'Home', link: '/home' },
  { text: 'Innovation', link: '/innovation' },
  { text: 'Profile', link: '/profile' },
  { text: 'Settings', link: '/settings' },
  { text: 'Forms', link: '/forms' }
]

const Sidebar = () => {
  return (
    <aside className="w-48 h-full  dark:bg-[#0a0e1a] p-4   ">
      <ul>
        {sidebarContent.map((item, index) => (
          <li key={`${index}-${item.text}`} className="mb-4">
            <Link to={item.link} className="hover:underline">
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
