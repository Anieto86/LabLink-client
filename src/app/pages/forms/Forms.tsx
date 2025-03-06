import { FormBuilder } from '@/app/features/FormTemplates/FormBuilder'
import { FormTemplates } from '@/app/features/FormTemplates/FormTemplates'
import { Separator } from '@/app/components/ui/separator'

const Forms = () => {
  return (
    <>
      <FormTemplates />
      <Separator />
      <FormBuilder />
    </>
  )
}

export default Forms
