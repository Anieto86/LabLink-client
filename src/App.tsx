import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { BASE_URL } from './api'
import './App.css'

function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () => fetch(BASE_URL).then((res) => res.json())
  })

  if (isPending) return 'Loading...'

  if (error) return `An error has occurred: ${error.message}`

  return (
    <>
      {data.message}
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <h1 className="text-3xl text-red-800 font-bold underline">Hello world!</h1>
      <Button className="btn-secondary">Click me</Button>
    </>
  )
}

export default App
