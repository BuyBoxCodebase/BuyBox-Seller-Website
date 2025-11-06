import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { VideosPrimaryButtons } from './components/videos-primary-buttons'
import VideosProvider from './context/videos-context'
import { VideosDialogs } from './components/videos-dialog'
import useGetVideos from '@/hooks/reels/useGetReels'
import { VideoShowcase } from './components/video-data-showcase'

export default function Videos() {
    const { videos, loading } = useGetVideos()
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = sessionStorage.getItem('token')
        token == null ? navigate({ to: '/landing' }) : null
    }, [navigate])

    const handleDelete = (id: string) => {
        // Implement your delete logic here
        console.log('Delete video:', id)
    }

    const handleEdit = (video: any) => {
        // Implement your edit logic here
        console.log('Edit video:', video)
    }

    return (
        <>
            <VideosProvider>
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
                            <h2 className='text-2xl font-bold tracking-tight'>Videos</h2>
                            <p className='text-muted-foreground'>
                                Here&apos;s a showcase of your videos
                            </p>
                        </div>
                        <VideosPrimaryButtons />
                    </div>
                    <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
                        <VideoShowcase 
                            videos={videos} 
                            isLoading={loading}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    </div>
                </Main>
                <VideosDialogs />
            </VideosProvider>
        </>
    )
}