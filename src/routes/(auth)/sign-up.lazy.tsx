import { createLazyFileRoute } from '@tanstack/react-router'
// import SignUp from '@/features/auth/sign-up'
import SignIn from '@/features/auth/sign-in'

export const Route = createLazyFileRoute('/(auth)/sign-up')({
  // component: SignUp,
  component: SignIn,
})
