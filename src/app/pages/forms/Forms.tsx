// import { FormTemplates } from '@/app/features/FormTemplates/FormTemplates'
// import { Separator } from '@/app/components/ui/separator'
import { CreateFormButton } from '@/app/features/FormTemplates/CreateFormButton'
import { FormsCard } from '@/app/features/FormTemplates/FormsCard'
import { Suspense } from 'react'

const Forms = () => {
  return (
    <>
      {/* <FormTemplates /> */}
      <h2 className="text-4xl font-bold col-span-2 my-4">Your Experiments</h2>
      <CreateFormButton />
      <Suspense fallback={<div>Loading...</div>}>
        <FormsCard />
      </Suspense>
    </>
  )
}

export default Forms
