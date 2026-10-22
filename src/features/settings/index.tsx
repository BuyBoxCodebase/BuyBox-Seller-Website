import { Outlet, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useEffect } from 'react'

// Settings pages are reached from the main sidebar (Settings › Profile / Seller Profile / Appearance),
// so there is no second navigation here and the page scrolls as a whole.
export default function Settings() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    token == null ? navigate({ to: '/landing' }) : null
  }, [navigate])
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mx-auto w-full max-w-3xl'>
          <Outlet />
        </div>
      </Main>
    </>
  )
}
