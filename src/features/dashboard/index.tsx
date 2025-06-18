import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import useGetBrand from '@/hooks/brand/useGetBrand'
import useGetAnalytics from '@/hooks/useGetAnalytics'
import useGetAllUser from '@/hooks/user/useGetUser'
import { useUsers } from '@/context/user/user-context'

export default function Dashboard() {
  const { analytics, loading } = useGetAnalytics();
  useGetBrand();
  const { users, loading: usersLoading } = useUsers();
  const navigate = useNavigate();

  // QR Code modal state
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [isQRLoading, setIsQRLoading] = useState(false);
  const [qrError, setQRError] = useState(null);
  const [modalStep, setModalStep] = useState('scan'); // 'scan' or 'verify'
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    if (!usersLoading && !users) {
      navigate({ to: '/landing' });
    }
  }, [users, usersLoading, navigate]);

  // Function to fetch QR code
  const fetchQRCode = async () => {
    setIsQRLoading(true);
    setQRError(null);
    setModalStep('scan');

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/seller/2fa/generate`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch QR code');
      }

      const data = await res.json();
      console.log(data);

      setQrCodeData(data.qrCodeUrl);
      setIsQRModalOpen(true);
    } catch (err: any) {
      console.error('Error fetching QR code:', err);
      setQRError(err.message);
    } finally {
      setIsQRLoading(false);
    }
  };

  // Function to verify the 2FA code
  const verifyCode = async () => {
    if (!verificationCode.trim()) {
      setVerificationError('Please enter the verification code');
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/seller/2fa/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Verification failed');
      }

      closeModal();
    } catch (err: any) {
      console.error('Error verifying code:', err);
      setVerificationError(err.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const closeModal = () => {
    setIsQRModalOpen(false);
    setModalStep('scan');
    setVerificationCode('');
    setVerificationError(null);
  };

  if (!analytics && !loading) return null;

  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button
              onClick={fetchQRCode}
              disabled={isQRLoading}
            >
              {isQRLoading ? 'Loading...' : 'Enable 2FA'}
            </Button>
          </div>
        </div>

        {qrError && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            Error loading QR code: {qrError}
          </div>
        )}

        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics' disabled>
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            {loading ? (
              <div>Loading analytics...</div>
            ) : (
              <>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>
                        Total Revenue
                      </CardTitle>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        className='h-4 w-4 text-muted-foreground'
                      >
                        <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>
                        ${analytics?.totalRevenue.amount || '0.00'}
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        {analytics?.totalRevenue.change || 'No change'}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>
                        Subscriptions
                      </CardTitle>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        className='h-4 w-4 text-muted-foreground'
                      >
                        <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                        <circle cx='9' cy='7' r='4' />
                        <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>
                        +{analytics?.subscriptions.count || '0'}
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        {analytics?.subscriptions.change || 'No change'}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>Sales</CardTitle>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        className='h-4 w-4 text-muted-foreground'
                      >
                        <rect width='20' height='14' x='2' y='5' rx='2' />
                        <path d='M2 10h20' />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>
                        +{analytics?.sales.count || '0'}
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        {analytics?.sales.change || 'No change'}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>
                        Active Now
                      </CardTitle>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        className='h-4 w-4 text-muted-foreground'
                      >
                        <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>
                        {analytics?.activeNow.count || '0'}
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        {analytics?.activeNow.change || 'No change'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
                  <Card className='col-span-1 lg:col-span-4'>
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2'>
                      <Overview data={analytics?.monthlyData || []} />
                    </CardContent>
                  </Card>
                  <Card className='col-span-1 lg:col-span-3'>
                    <CardHeader>
                      <CardTitle>Recent Sales</CardTitle>
                      <CardDescription>
                        You made {analytics?.recentSales.totalSales || '0'} sales this month.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentSales customers={analytics?.recentSales.customers || []} totalSales={0} />
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </Main>

      {/* QR Code Modal */}
      {isQRModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">
                {modalStep === 'scan' ? 'Scan QR Code' : 'Verify Code'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {modalStep === 'scan' ? (
              <>
                <div className="flex justify-center">
                  {qrCodeData ? (
                    <img
                      src={qrCodeData.startsWith('data:') ? qrCodeData : `data:image/png;base64,${qrCodeData}`}
                      alt="QR Code for 2FA"
                      className="w-64 h-64"
                    />
                  ) : (
                    <div className="w-64 h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      No QR code available
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                  1. Scan this QR code with your authenticator app.<br />
                  2. Enter the verification code from your app to complete setup.
                </div>

                <div className="mt-4 flex justify-center">
                  <Button
                    onClick={closeModal}
                    variant="outline"
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setModalStep('verify')}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Enter the 6-digit code from your authenticator app
                  </label>
                  <input
                    id="verification-code"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                  />
                </div>

                {verificationError && (
                  <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded text-sm">
                    {verificationError}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => setModalStep('scan')}
                    variant="outline"
                    className="mr-2"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={verifyCode}
                    disabled={isVerifying}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: '/products',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Settings',
    href: '/settings',
    isActive: false,
    disabled: false,
  },
]