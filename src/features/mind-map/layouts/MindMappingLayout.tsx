import { Outlet } from 'react-router-dom'

import { Suspense } from 'react'
import { Column } from '@/shared/ui/design/Grid'

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
