import ContentSection from '../components/content-section'
import { AccountForm } from './account-form'
import { PasswordCard } from './password-card'

export default function SettingsAccount() {
  return (
    <ContentSection
      title='Seller Profile'
      desc='Update your seller profile information. Set your profile image, description, and location.'
    >
      <div className='space-y-6'>
        <AccountForm />
        <PasswordCard />
      </div>
    </ContentSection>
  )
}
