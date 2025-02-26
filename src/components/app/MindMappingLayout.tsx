import { Outlet } from 'react-router-dom'
import { Column } from '../design/Grid'

import { Suspense } from 'react'

const MindMappingLayout = () => {
  return (
    <Column className="w-full h-full items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </Column>
  )
}

export default MindMappingLayout
