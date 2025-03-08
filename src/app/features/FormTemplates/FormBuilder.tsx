import { Controller, useFieldArray, useForm } from 'react-hook-form'
import type { FormData } from './FormTemplateTypes'
import { Input } from '@/app/components/design/Input'
import { Button } from '@/app/components/design/Button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'

export const FormBuilder = () => {
  const { control, handleSubmit, register } = useForm<FormData>({
    defaultValues: {
      fields: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields'
  })

  const onSubmit = (data: FormData) => {
    // send data to the server
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <Input placeholder="Label" {...register(`fields.${index}.label` as const)} />

          {/* Shadcn select con react-hook-form */}
          <Controller
            control={control}
            name={`fields.${index}.type` as const}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <Button className="bg-red-700 text-white" type="button" onClick={() => remove(index)} variant="outline">
            Remove
          </Button>
        </div>
      ))}

      <div className="flex gap-2">
        <Button type="button" onClick={() => append({ label: '', type: 'text' })}>
          Add Field
        </Button>
        <Button type="submit">Create</Button>
      </div>
    </form>
  )
}
