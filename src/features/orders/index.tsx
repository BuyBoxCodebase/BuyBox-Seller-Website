import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { OrderDataTable } from './components/order-data-table'
// import { TasksDialogs } from './components/tasks-dialogs'
import TasksProvider from './context/tasks-context'
import { columns } from './components/order-columns'
import useGetAllOrders from '@/hooks/orders/useGetOrders'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import useGetAllUser from '@/hooks/user/useGetUser'
import { useUsers } from '@/context/user/user-context'

export default function Orders() {
  const { orders, loading } = useGetAllOrders();
  const { users, loading: usersLoading } = useUsers();
    const navigate = useNavigate();
    
    useEffect(() => {
      if (!usersLoading && !users) {
        navigate({ to: '/landing' });
      }
    }, [users, usersLoading, navigate]);
  
  return (
    <TasksProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Orders</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your orders
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <OrderDataTable data={orders} columns={columns} isLoading={loading} />
        </div>
      </Main>
      {/* <TasksDialogs /> */}
    </TasksProvider>
  )
}
