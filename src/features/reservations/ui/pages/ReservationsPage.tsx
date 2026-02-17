import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/shared/ui/design/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/design/Card'
import { Input } from '@/shared/ui/design/Input'
import { useAuthSession } from '@/features/auth/state/AuthSessionProvider'
import { useCreateReservation, useDeleteReservation, useReservations, useUpdateReservation } from '@/features/reservations/model/useReservations'
import type { Reservation } from '@/features/reservations/model/reservation.types'
import type { ApiError } from '@/shared/lib/apiClient'

const ensureSeconds = (value: string) => (value.length === 5 ? `${value}:00` : value)

const buildEmptyForm = (userId = '') => ({
  userId,
  laboratoryId: '',
  resourceId: '',
  reservationDate: '',
  startTime: '',
  endTime: ''
})

const ReservationsPage = () => {
  const { user } = useAuthSession()
  const [onlyMyReservations, setOnlyMyReservations] = useState(false)
  const { data, isLoading } = useReservations(onlyMyReservations ? user?.id : undefined)
  const createMutation = useCreateReservation()
  const updateMutation = useUpdateReservation()
  const deleteMutation = useDeleteReservation()

  const [form, setForm] = useState(buildEmptyForm(user?.id || ''))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const submitLabel = useMemo(() => (editingId ? 'Update reservation' : 'Create reservation'), [editingId])

  const handleEdit = (item: Reservation) => {
    setEditingId(item.id)
    setForm({
      userId: item.userId,
      laboratoryId: item.laboratoryId || '',
      resourceId: item.resourceId || '',
      reservationDate: item.reservationDate,
      startTime: item.startTime.slice(0, 5),
      endTime: item.endTime.slice(0, 5)
    })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    const payload = {
      ...form,
      userId: form.userId || user?.id || '',
      startTime: ensureSeconds(form.startTime),
      endTime: ensureSeconds(form.endTime)
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      setEditingId(null)
      setForm(buildEmptyForm(user?.id || ''))
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.code === 'CONFLICT' ? 'Reservation overlaps with an existing slot.' : apiError.message || 'Operation failed')
    }
  }

  return (
    <section className="space-y-6 p-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Reservations</h1>
        <Button type="button" variant="outline" onClick={() => setOnlyMyReservations((prev) => !prev)}>
          {onlyMyReservations ? 'Show all reservations' : 'Show my reservations'}
        </Button>
      </div>

      <Card className="border">
        <CardHeader>
          <CardTitle>{submitLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-3" onSubmit={handleSubmit}>
            <Input
              placeholder="User ID"
              required
              value={form.userId}
              onChange={(e) => setForm((prev) => ({ ...prev, userId: e.target.value }))}
            />
            <Input placeholder="Laboratory ID" value={form.laboratoryId} onChange={(e) => setForm((prev) => ({ ...prev, laboratoryId: e.target.value }))} />
            <Input placeholder="Resource ID" value={form.resourceId} onChange={(e) => setForm((prev) => ({ ...prev, resourceId: e.target.value }))} />
            <Input
              required
              type="date"
              value={form.reservationDate}
              onChange={(e) => setForm((prev) => ({ ...prev, reservationDate: e.target.value }))}
            />
            <Input required type="time" value={form.startTime} onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))} />
            <Input required type="time" value={form.endTime} onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))} />
            {error ? <p className="md:col-span-3 text-sm text-red-600">{error}</p> : null}
            <div className="md:col-span-3 flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {submitLabel}
              </Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setForm(buildEmptyForm(user?.id || ''))
                  }}
                >
                  Cancel edit
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader>
          <CardTitle>Reservation list</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <p>Loading...</p> : null}
          <ul className="space-y-2">
            {(data || []).map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded border p-3">
                <div>
                  <p className="font-medium">
                    {item.reservationDate} {item.startTime} - {item.endTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    User: {item.userId} | Lab: {item.laboratoryId || 'N/A'} | Resource: {item.resourceId || 'N/A'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                  <Button type="button" variant="outline" onClick={() => deleteMutation.mutate(item.id)} disabled={deleteMutation.isPending}>
                    Cancel
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}

export default ReservationsPage
