import { useForm } from 'react-hook-form'
import type { FormDataType } from './FormTemplateTypes'
import { Input } from '@/app/components/design/Input'
import { Button } from '@/app/components/design/Button'
import { Textarea } from '@/app/components/ui/textarea'

export const FormBuilder = () => {
  const { handleSubmit, register } = useForm<FormDataType>({
    defaultValues: {
      fields: []
    }
  })

  const onSubmit = (data: FormDataType) => {
    // send data to the server
    // console.log(data)
    try {
      //add toast
      console.log(data)
    } catch (error) {
      //add toast
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="flex flex-col items-center gap-2 ">
        <Input placeholder="Name" {...register('fields.0.label')} />
        <Textarea placeholder="Description" {...register('fields.0.type')} className="border p-2 rounded" />
      </div>
      <div className="flex gap-2 ">
        <Button className="w-full" type="submit">
          Save
        </Button>
      </div>
    </form>
  )
}
