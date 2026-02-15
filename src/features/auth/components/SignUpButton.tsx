import { Button } from '@/shared/ui/design/Button'

type SignUpButtonProps = {
  googleLogin: () => void
  combinedIsLoading: boolean
  errorMessage?: string
}

export const SignUpButton = ({ googleLogin, combinedIsLoading, errorMessage }: SignUpButtonProps) => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex items-center">
        <div className="flex-grow h-px bg-gray-300" />
        <span className="px-3 text-gray-500 text-sm">OR</span>
        <div className="flex-grow h-px bg-gray-300" />
      </div>

      <Button
        type="button"
        onClick={() => {
          googleLogin()
        }}
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        disabled={combinedIsLoading}
      >
        Sign up with Google
      </Button>
      {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errorMessage}</div>}
    </div>
  )
}
