import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={cn('rounded-lg bg-white p-6 shadow', className)}>{children}</div>
}

const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={cn('mb-4', className)}>{children}</div>
}

const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <h2 className={cn('text-xl font-semibold', className)}>{children}</h2>
}

const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={cn('', className)}>{children}</div>
}

export { Card, CardHeader, CardTitle, CardContent }
