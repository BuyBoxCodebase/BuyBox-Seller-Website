import ContentSection from '../components/content-section'
import { AccountForm } from './account-form'

export default function SettingsAccount() {
  return (
    <ContentSection
      title='Seller Profile'
      desc='Update your seller profile information. Set your profile image, description, and location.'
    >
      <AccountForm />
    </ContentSection>
  )
}
