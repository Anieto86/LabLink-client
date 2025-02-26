import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { authenticatedRoutes } from './authenticatedRoutes'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/">{authenticatedRoutes}</Route>
      {/* <Route path="/*">{guestRoutes}</Route> */}
    </>
  )
)
