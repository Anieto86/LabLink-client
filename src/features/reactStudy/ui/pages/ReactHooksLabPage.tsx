import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/shared/ui/design/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/design/Card'
import { Input } from '@/shared/ui/design/Input'

const UnoptimizedChild = ({ onIncrement }: { onIncrement: () => void }) => {
  // useRef guarda datos entre renders sin provocar nuevo render.
  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <div className="rounded border p-3">
      <p className="font-medium">Child without optimization</p>
      <p className="text-sm text-gray-600">Renders: {renderCount.current}</p>
      <Button type="button" variant="outline" onClick={onIncrement}>
        Increment shared count
      </Button>
    </div>
  )
}

// React.memo evita re-render si las props no cambian.
const OptimizedChild = memo(({ onIncrement }: { onIncrement: () => void }) => {
  // Contador visual para comparar cuantas veces pinta cada hijo.
  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <div className="rounded border p-3">
      <p className="font-medium">Child with React.memo + useCallback</p>
      <p className="text-sm text-gray-600">Renders: {renderCount.current}</p>
      <Button type="button" variant="outline" onClick={onIncrement}>
        Increment shared count
      </Button>
    </div>
  )
})

const EffectProbeChild = ({ onMount, onCleanup }: { onMount: () => void; onCleanup: () => void }) => {
  useEffect(() => {
    // Simula side effect al montar.
    onMount()
    return () => {
      // Simula limpieza de side effect al desmontar.
      onCleanup()
    }
  }, [onMount, onCleanup])

  return <div className="rounded border p-2 text-sm">Probe mounted</div>
}

const StrictModeProbe = () => {
  const [visible, setVisible] = useState(true)
  const [mounts, setMounts] = useState(0)
  const [cleanups, setCleanups] = useState(0)
  // useCallback mantiene referencia estable y evita renders por nueva funcion.
  const handleMount = useCallback(() => setMounts((prev) => prev + 1), [])
  const handleCleanup = useCallback(() => setCleanups((prev) => prev + 1), [])

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>StrictMode effect behavior</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">
          In development, React StrictMode intentionally mounts and unmounts components twice to detect side effects.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setVisible((prev) => !prev)}>
            {visible ? 'Unmount probe' : 'Mount probe'}
          </Button>
          <span className="text-sm">Mounts recorded: {mounts}</span>
          <span className="text-sm">Cleanups recorded: {cleanups}</span>
        </div>
        {visible ? <EffectProbeChild onMount={handleMount} onCleanup={handleCleanup} /> : null}
      </CardContent>
    </Card>
  )
}

const ReactHooksLabPage = () => {
  // Ref al DOM: caso clasico de useRef (focus imperativo).
  const inputRef = useRef<HTMLInputElement | null>(null)
  // Ref de dato mutable: guarda el valor previo sin re-render.
  const previousValueRef = useRef('')
  const [name, setName] = useState('')
  const [sharedCount, setSharedCount] = useState(0)
  const [parentText, setParentText] = useState('')

  // Cuenta los renders del padre para ver impacto de cambios locales.
  const parentRenderCount = useRef(0)
  parentRenderCount.current += 1

  // Funcion nueva en cada render: forzara re-render en hijo no memorizado.
  const handleIncrement = () => {
    setSharedCount((prev) => prev + 1)
  }

  // Funcion estable: permite que React.memo del hijo haga efecto.
  const memoizedIncrement = useCallback(() => {
    setSharedCount((prev) => prev + 1)
  }, [])

  // useMemo evita recalcular trabajo costoso mientras dependencias no cambien.
  const expensiveLabel = useMemo(() => {
    let total = 0
    for (let index = 0; index < 50000; index += 1) {
      total += index
    }
    return `Expensive calc result: ${total}`
  }, [sharedCount])

  return (
    <section className="space-y-6 p-4">
      <h1 className="text-2xl font-semibold">React Hooks Lab</h1>
      <p className="text-sm text-gray-600">
        Study page with useRef, StrictMode behavior, parent-child relationship and unnecessary re-renders.
      </p>

      <Card className="border">
        <CardHeader>
          <CardTitle>useRef practical use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            ref={inputRef}
            placeholder="Write your name"
            value={name}
            onChange={(event) => {
              previousValueRef.current = name
              setName(event.target.value)
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => inputRef.current?.focus()}>
              Focus input (DOM with useRef)
            </Button>
            <span className="text-sm">Current value: {name || 'empty'}</span>
            <span className="text-sm">Previous value: {previousValueRef.current || 'empty'}</span>
          </div>
        </CardContent>
      </Card>

      <StrictModeProbe />

      <Card className="border">
        <CardHeader>
          <CardTitle>Parent-child and unnecessary re-renders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">Parent renders: {parentRenderCount.current}</p>
          <Input placeholder="Typing here re-renders parent" value={parentText} onChange={(event) => setParentText(event.target.value)} />
          <p className="text-sm">Shared count: {sharedCount}</p>
          <p className="text-sm text-gray-600">{expensiveLabel}</p>
          <div className="grid gap-3 md:grid-cols-2">
            <UnoptimizedChild onIncrement={handleIncrement} />
            <OptimizedChild onIncrement={memoizedIncrement} />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default ReactHooksLabPage
