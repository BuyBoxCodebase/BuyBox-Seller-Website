import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState, useRef } from 'react'

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  email: z
    .string({
      required_error: 'Please enter your email.',
    })
    .email(),
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Name must not be longer than 50 characters.',
    }),
  profilePic: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileForm() {
  const userString = sessionStorage.getItem('user');
  const userData = userString ? JSON.parse(userString) : null;
  const [profilePic, setProfilePic] = useState<string>(userData?.profilePic || '/api/placeholder/96/96');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const defaultValues: Partial<ProfileFormValues> = {
    username: userData?.username || '',
    name: userData?.name || '',
    profilePic: userData?.profilePic || '',
    email: userData?.email || '',
  }


  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  async function onSubmit(data: ProfileFormValues) {

    try {
      const submitData = {
        ...data,
        profilePic
      };
      const response = await fetch(`${import.meta.env.VITE_BASEURL}/auth/seller/update-profile`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });
      const resdata = await response.json();
      //  console.log('Data:', resdata);
     // console.log(resdata);
      if (resdata.success) {
        toast({
          title: 'Profile updated successfully',
          description: 'Your profile has been updated successfully',
        })
      }

    } catch (error) {
      //console.error("Update error:", error);
    }
  }
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePic(event.target.result.toString());
          form.setValue('profilePic', event.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90"
              onClick={handlePictureClick}
            >
              <Camera size={16} />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
          </div>
          <FormDescription className="mt-2 text-center">
            Click the camera icon to update your profile picture
          </FormDescription>
        </div>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Your full name' {...field} />
              </FormControl>
              <FormDescription>
                This is your full name as displayed on your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='username' {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* //just show the email */}
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input disabled value={field.value} />
              </FormControl>
              <FormDescription>
                This is your email address. You cannot change this.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Update profile</Button>
      </form>
    </Form>
  )
}