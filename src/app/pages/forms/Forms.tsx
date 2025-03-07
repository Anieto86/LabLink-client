import { FormBuilder } from '@/app/features/FormTemplates/FormBuilder'
// import { FormTemplates } from '@/app/features/FormTemplates/FormTemplates'
// import { Separator } from '@/app/components/ui/separator'
import { CreateFormButton } from '@/app/features/FormTemplates/CreateFormButton'

const Forms = () => {
  return (
    <>
      {/* <FormTemplates /> */}
      <h2 className="text-4xl font-bold col-span-2">Your Experiments</h2>

      <CreateFormButton />
      <FormBuilder />
    </>
  )
}

export default Forms
