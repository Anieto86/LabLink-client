import { Outlet } from 'react-router-dom'

const GuestLayout = () => {
  return (
    <div>
      <header>Guest Header</header>
      <main>
        <Outlet />
      </main>
      <footer>Guest Footer</footer>
    </div>
  )
}

export default GuestLayout
