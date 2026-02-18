import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/shared/ui/design/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/design/Card'
import { Input } from '@/shared/ui/design/Input'

const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

const bookingFormSchema = z
  .object({
    // Campo requerido para identificar laboratorio.
    labName: z.string().min(3, 'Lab name must have at least 3 characters'),
    // Fecha requerida para la reserva.
    bookingDate: z.string().min(1, 'Booking date is required'),
    // Horas con formato HH:mm.
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Start time is invalid'),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'End time is invalid'),
    requesterEmail: z.string().email('Requester email is invalid'),
    // Enum simple para validar turno permitido.
    shift: z.enum(['morning', 'afternoon'], { message: 'Shift is required' }),
    // coerce convierte string del input number a numero real.
    attendees: z.coerce.number().int('Attendees must be an integer').min(1, 'Minimum 1 attendee').max(30, 'Maximum 30 attendees'),
    notes: z.string().max(120, 'Notes must have at most 120 characters').optional()
  })
  .refine((data) => toMinutes(data.endTime) > toMinutes(data.startTime), {
    // Validacion cruzada entre 2 campos.
    message: 'End time must be later than start time',
    path: ['endTime']
  })

type BookingFormValues = z.infer<typeof bookingFormSchema>

const ShiftSelector = ({
  value,
  onValueChange
}: {
  value?: 'morning' | 'afternoon'
  onValueChange: (value: 'morning' | 'afternoon') => void
}) => {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant={value === 'morning' ? 'default' : 'outline'}
        onClick={() => onValueChange('morning')}
      >
        Morning
      </Button>
      <Button
        type="button"
        variant={value === 'afternoon' ? 'default' : 'outline'}
        onClick={() => onValueChange('afternoon')}
      >
        Afternoon
      </Button>
    </div>
  )
}

const RhfZodBookingStudy = () => {
  const [bookingSummary, setBookingSummary] = useState<BookingFormValues | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<BookingFormValues>({
    // Conecta Zod con RHF para validar en submit/blur/change segun mode.
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      labName: '',
      bookingDate: '',
      startTime: '',
      endTime: '',
      requesterEmail: '',
      shift: 'morning',
      attendees: 1,
      notes: ''
    },
    mode: 'onBlur'
  })

  const onSubmit = (values: BookingFormValues) => {
    setBookingSummary(values)
    reset(values)
  }

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Booking form with RHF + Zod</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            {/* register: ideal para inputs nativos/simples. */}
            <Input placeholder="Lab name" {...register('labName')} />
            {errors.labName ? <p className="text-sm text-red-600">{errors.labName.message}</p> : null}
          </div>

          <div className="space-y-1">
            <Input type="date" {...register('bookingDate')} />
            {errors.bookingDate ? <p className="text-sm text-red-600">{errors.bookingDate.message}</p> : null}
          </div>

          <div className="space-y-1">
            <Input type="time" {...register('startTime')} />
            {errors.startTime ? <p className="text-sm text-red-600">{errors.startTime.message}</p> : null}
          </div>

          <div className="space-y-1">
            <Input type="time" {...register('endTime')} />
            {errors.endTime ? <p className="text-sm text-red-600">{errors.endTime.message}</p> : null}
          </div>

          <div className="space-y-1">
            <Input type="email" placeholder="Requester email" {...register('requesterEmail')} />
            {errors.requesterEmail ? <p className="text-sm text-red-600">{errors.requesterEmail.message}</p> : null}
          </div>

          <div className="space-y-1">
            {/* Controller: util para componentes controlados/custom. */}
            <Controller
              name="shift"
              control={control}
              render={({ field }) => <ShiftSelector value={field.value} onValueChange={field.onChange} />}
            />
            {errors.shift ? <p className="text-sm text-red-600">{errors.shift.message}</p> : null}
          </div>

          <div className="space-y-1">
            <Input type="number" min={1} max={30} {...register('attendees')} />
            {errors.attendees ? <p className="text-sm text-red-600">{errors.attendees.message}</p> : null}
          </div>

          <div className="space-y-1 md:col-span-2">
            <Input placeholder="Notes (optional)" {...register('notes')} />
            {errors.notes ? <p className="text-sm text-red-600">{errors.notes.message}</p> : null}
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={isSubmitting}>
              Save booking
            </Button>
          </div>
        </form>

        {bookingSummary ? (
          <p className="text-sm text-gray-600">
            Latest booking: {bookingSummary.labName} on {bookingSummary.bookingDate} ({bookingSummary.startTime} - {bookingSummary.endTime}) | shift: {bookingSummary.shift}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default RhfZodBookingStudy
