import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './routes/router'

const AppRouter = () => <RouterProvider router={router} />

export default AppRouter
