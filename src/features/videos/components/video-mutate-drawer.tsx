import { useState, useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { HiOutlineTrash } from 'react-icons/hi'
import { Videos } from '../data/schema'
import useGetProducts from '@/hooks/products/useGetProducts'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Videos
  baseUrl?: string
  isCategory?: boolean
  isVariant?: boolean
}

const formSchema = z.object({
  productId: z.string().nonempty('Product is required'),
  size: z.string().nonempty('Size is required'),
  caption: z.string().nonempty('Caption is required'),
  videoUrl: z.string().nonempty('Video URL is required'),
})

type VideoForm = z.infer<typeof formSchema>

export function VideosMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  baseUrl = import.meta.env.VITE_BASE_URL as string,
}: Props) {
  const isUpdate = !!currentRow
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const { products, loading } = useGetProducts()

  const form = useForm<VideoForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ? {
      productId: currentRow.productId,
      size: currentRow.size,
      caption: currentRow.caption,
      videoUrl: currentRow.videoUrl,
    } : {
      productId: '',
      size: '',
      caption: '',
      videoUrl: '',
    },
  })

  useEffect(() => {
    if (isUpdate && currentRow) {
      setUploadedVideoUrl(currentRow.videoUrl || '')
    } else {
      setUploadedVideoUrl('')
    }
  }, [isUpdate, currentRow, open])

  const filteredProducts = products?.filter((product: any) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      
      if (!file.type.startsWith('video/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a video file.',
          variant: 'destructive',
        })
        return
      }

      setSelectedVideo(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleBrowseClick = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click()
    }
  }

  const removeVideo = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedVideo(null)
    setPreviewUrl('')
    if (videoInputRef.current) {
      videoInputRef.current.value = ''
    }
  }

  const removeUploadedVideo = () => {
    setUploadedVideoUrl('')
    form.setValue('videoUrl', '')
  }

  const handleUploadVideo = async () => {
    if (!selectedVideo) {
      toast({
        title: 'No video selected',
        description: 'Please select a video to upload.',
        variant: 'destructive',
      })
      return
    }

    const formData = new FormData()
    formData.append('files', selectedVideo)

    try {
      setIsUploading(true)
      toast({
        title: 'Uploading video...',
      })

      const response = await fetch(`${baseUrl}/reels/upload/images`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        toast({
          title: 'Failed to upload video',
          description: 'Please try again.',
          variant: 'destructive',
        })
        return
      }

      const data = await response.json()
      const videoUrl = data[0].url
      
      setUploadedVideoUrl(videoUrl)
      form.setValue('videoUrl', videoUrl)
      
      // Don't call removeVideo() - just clear the File object
      // Keep previewUrl intact so video stays visible
      setSelectedVideo(null)

      toast({
        title: 'Video uploaded successfully',
      })
    } catch (error) {
      toast({
        title: 'Failed to upload video',
        description: 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: VideoForm) => {
    console.log('Form Values:', form.getValues())
    const url = `${baseUrl}/reels/${isUpdate ? `update/${currentRow?.productId}` : 'create'}`

    try {
      const response = await fetch(url, {
        method: isUpdate ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        toast({
          title: `Failed to ${isUpdate ? 'update' : 'create'} video`,
          description: 'Please try again.',
          variant: 'destructive',
        })
        return
      }

      onOpenChange(false)
      form.reset()
      setUploadedVideoUrl('')
      removeVideo()

      toast({
        title: `Video ${isUpdate ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: `Failed to ${isUpdate ? 'update' : 'create'} video`,
        description: 'Please try again.',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    console.log('Form Values:', form.getValues())
  }, [form])

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) {
          form.reset()
          setUploadedVideoUrl('')
          removeVideo()
          setSearchQuery('')
        }
      }}
    >
      <SheetContent className="flex flex-col overflow-y-auto max-h-screen w-full">
        <SheetHeader className='text-left'>
          <SheetTitle>
            {isUpdate ? 'Update' : 'Create'} Video
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the video by providing necessary info.'
              : 'Add a new video by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='video-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-5 mt-4'
          >
            <FormField
              control={form.control}
              name='productId'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Product</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    open={isSelectOpen}
                    onOpenChange={setIsSelectOpen}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <div className="px-2 py-2 sticky top-0 bg-white z-10">
                        <Input
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="h-8"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </div>
                      {loading ? (
                        <SelectItem value="loading" disabled>
                          Loading products...
                        </SelectItem>
                      ) : filteredProducts.length === 0 ? (
                        <SelectItem value="no-products" disabled>
                          No products found
                        </SelectItem>
                      ) : (
                        filteredProducts.map((product: any) => {
                          const productImage = product.images?.[0] || product.defaultVariant?.images?.[0]
                          return (
                            <SelectItem key={product.id} value={product.id}>
                              <div className="flex items-center gap-2">
                                {productImage && (
                                  <img 
                                    src={productImage} 
                                    alt={product.name}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                )}
                                <span>{product.name}</span>
                              </div>
                            </SelectItem>
                          )
                        })
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='size'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter the product size' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='caption'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Enter the video caption'
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Video</FormLabel>

              {!uploadedVideoUrl ? (
                <>
                  {!selectedVideo ? (
                    <div
                      className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      onClick={handleBrowseClick}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to select</span> a video
                        </p>
                        <p className="text-xs text-gray-500">
                          MP4, MOV, AVI, WebM
                        </p>
                      </div>
                      <input
                        ref={videoInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleVideoSelect}
                        accept="video/*"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative group">
                        <video
                          src={previewUrl}
                          controls
                          className="w-full h-64 object-contain rounded-md bg-black"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-md pointer-events-none"></div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={removeVideo}
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        onClick={handleUploadVideo}
                        disabled={isUploading}
                        className="w-full"
                      >
                        {isUploading ? 'Uploading...' : 'Upload Video'}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Uploaded Video</h3>
                  <div className="relative group">
                    <video
                      src={uploadedVideoUrl}
                      controls
                      className="w-full h-64 object-contain rounded-md bg-black"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-md pointer-events-none"></div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={removeUploadedVideo}
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </Form>
        <SheetFooter className="mt-5 gap-2">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button form="video-form" type="submit">
            {isUpdate ? 'Update' : 'Create'} Video
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}