import { Outlet } from 'react-router-dom'
import { Column } from '../design/Grid'
import Navbar from './navbar/Navbar'
import { Suspense } from 'react'

const MindMappingLayout = () => {
  return (
    <Column className="w-full h-full items-center">
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </Column>
  )
}

export default MindMappingLayout
