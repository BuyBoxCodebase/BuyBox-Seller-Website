import ContentSection from '../components/content-section'
import { AccountForm } from './account-form'

export default function SettingsAccount() {
  return (
    <ContentSection
      title='Brand'
      desc='Update your brand information. Set your brand image and brand name.'
    >
      <AccountForm />
    </ContentSection>
  )
}
