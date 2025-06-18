import SettingsAccount from '@/features/settings/account'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/settings/brand')({
  component: SettingsAccount
})


