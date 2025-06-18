import Admin from '@/features/seller'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/seller')({
  component: Admin
})


