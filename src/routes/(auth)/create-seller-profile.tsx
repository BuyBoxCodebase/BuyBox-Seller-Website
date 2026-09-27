import CreateSellerProfile from '@/features/auth/create-brand'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/create-seller-profile')({
  component: CreateSellerProfile,
})
