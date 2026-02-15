import { Button } from '@/shared/ui/design/Button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/primitives/dialog'
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
            {
              //add form builder here
            }
            <FormBuilder />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

