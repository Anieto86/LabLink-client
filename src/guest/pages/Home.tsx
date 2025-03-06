import { BASE_URL } from '@/api'
import { Button } from '@/app/components/ui/button'
import { useQuery } from '@tanstack/react-query'

export const Home = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () => fetch(BASE_URL).then((res) => res.json())
  })

  if (isPending) return 'Loading...'

  if (error) return `An error has occurred: ${error.message}`

  return (
    <>
      {data.message}
      <Button className="btn-secondary">Click me</Button>
    </>
  )
}
