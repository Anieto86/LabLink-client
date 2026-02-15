import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/shared/ui/design/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/design/Card'
import { Input } from '@/shared/ui/design/Input'
import { useCreateResource, useDeleteResource, useResources, useUpdateResource } from '@/features/resources/model/useResources'
import type { Resource } from '@/features/resources/model/resource.types'
import type { ApiError } from '@/shared/lib/apiClient'

const emptyForm = { name: '', type: '', laboratoryId: '' }

const ResourcesPage = () => {
  const { data, isLoading } = useResources()
  const createMutation = useCreateResource()
  const updateMutation = useUpdateResource()
  const deleteMutation = useDeleteResource()

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const submitLabel = useMemo(() => (editingId ? 'Update resource' : 'Create resource'), [editingId])

  const handleEdit = (item: Resource) => {
    setEditingId(item.id)
    setForm({
      name: item.name,
      type: item.type || '',
      laboratoryId: item.laboratoryId || ''
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
      <h1 className="text-2xl font-semibold">Resources</h1>

      <Card className="border">
        <CardHeader>
          <CardTitle>{submitLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-3" onSubmit={handleSubmit}>
            <Input required placeholder="Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            <Input placeholder="Type" value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))} />
            <Input
              placeholder="Laboratory ID"
              value={form.laboratoryId}
              onChange={(e) => setForm((prev) => ({ ...prev, laboratoryId: e.target.value }))}
            />
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
          <CardTitle>Resource list</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <p>Loading...</p> : null}
          <ul className="space-y-2">
            {(data || []).map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded border p-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.type || 'No type'} | Lab: {item.laboratoryId || 'N/A'}
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

export default ResourcesPage
