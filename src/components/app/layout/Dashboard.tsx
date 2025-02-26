import Login from '../../login'
import FormTemplates from '../features/FormTemplates/FormTemplates'
import type { ReactNode } from 'react'

const DashboardContainer = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-areas-layout grid-cols-[auto_1fr] grid-rows-[auto_1fr] h-screen">{children}</div>
)

const Dashboard = () => {
  return (
    <DashboardContainer>
      <Login />
      <FormTemplates />
    </DashboardContainer>
  )
}

export default Dashboard
