import Videos from '@/features/videos'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/videos/')({
  component: Videos,
})


