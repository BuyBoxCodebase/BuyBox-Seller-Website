import Landing from '@/features/landing'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/landing')({
  component: Landing
})


