import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/shared/ui/design/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/design/Card'
import { Input } from '@/shared/ui/design/Input'
import { useCreateLaboratory, useDeleteLaboratory, useLaboratories, useUpdateLaboratory } from '@/features/laboratories/model/useLaboratories'
import type { Laboratory } from '@/features/laboratories/model/laboratory.types'
import type { ApiError } from '@/shared/lib/apiClient'

const emptyForm = { name: '', location: '', description: '' }

const LaboratoriesPage = () => {
  const { data, isLoading } = useLaboratories()
  const createMutation = useCreateLaboratory()
  const updateMutation = useUpdateLaboratory()
  const deleteMutation = useDeleteLaboratory()

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const submitLabel = useMemo(() => (editingId ? 'Update laboratory' : 'Create laboratory'), [editingId])

  const handleEdit = (item: Laboratory) => {
    setEditingId(item.id)
    setForm({
      name: item.name,
      location: item.location || '',
      description: item.description || ''
    })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, payload: form })
      } else {
        await createMutation.mutateAsync(form)
      }
      setEditingId(null)
      setForm(emptyForm)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Operation failed')
    }
  }

  return (
    <section className="space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Laboratories</h1>

      <Card className="border">
        <CardHeader>
          <CardTitle>{submitLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-3" onSubmit={handleSubmit}>
            <Input required placeholder="Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            <Input placeholder="Location" value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} />
            <Input placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
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
                    setForm(emptyForm)
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
          <CardTitle>Laboratory list</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <p>Loading...</p> : null}
          <ul className="space-y-2">
            {(data || []).map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded border p-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.location || 'No location'} | {item.description || 'No description'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                  <Button type="button" variant="outline" onClick={() => deleteMutation.mutate(item.id)} disabled={deleteMutation.isPending}>
                    Delete
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

export default LaboratoriesPage
