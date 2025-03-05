import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import AuthenticatedRoutes from './AuthenticatedRoutes'

export const router = createBrowserRouter(createRoutesFromElements(<Route path="/*" element={<AuthenticatedRoutes />} />))
