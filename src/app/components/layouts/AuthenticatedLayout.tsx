import { Outlet } from 'react-router-dom'

const AuthenticatedLayout = () => {
  return (
    <div>
      <header>Authenticated Header</header>
      <main>
        <Outlet />
      </main>
      <footer>Authenticated Footer</footer>
    </div>
  )
}

export default AuthenticatedLayout
