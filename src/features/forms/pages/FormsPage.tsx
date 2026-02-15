// import { FormTemplates } from '@/features/forms/components/FormTemplates'
import { CreateFormButton } from '@/features/forms/components/CreateFormButton'
import { FormsCard } from '@/features/forms/components/FormsCard'
import { Suspense } from 'react'

const FormsPage = () => {
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

export default FormsPage

