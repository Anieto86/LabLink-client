import CoreReactStudy from '@/features/reactStudy/ui/components/CoreReactStudy'
import RhfZodBookingStudy from '@/features/reactStudy/ui/components/RhfZodBookingStudy'

const ReactHooksLabPage = () => {

  return (
    <section className="space-y-6 p-4">
      <h1 className="text-2xl font-semibold">React Hooks Lab</h1>
      <p className="text-sm text-gray-600">
        Study page with useRef, StrictMode behavior, parent-child relationship and unnecessary re-renders.
      </p>

      <CoreReactStudy />
      <RhfZodBookingStudy />
    </section>
  )
}

export default ReactHooksLabPage
