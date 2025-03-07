import { Button } from '@/app/components/design/Button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog'
import { FormBuilder } from './FormBuilder'

export const CreateFormButton = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>New Experiment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Record</DialogTitle>
          <DialogDescription>Create a new experiment record</DialogDescription>
          <DialogDescription>
            <FormBuilder />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
