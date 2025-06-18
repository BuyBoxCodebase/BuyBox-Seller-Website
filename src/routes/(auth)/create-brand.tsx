import CreateBrand from '@/features/auth/create-brand'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/create-brand')({
  component: CreateBrand,
})

