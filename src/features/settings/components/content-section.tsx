interface ContentSectionProps {
  title: string
  desc: string
  children: React.JSX.Element
}

export default function ContentSection({
  title,
  desc,
  children,
}: ContentSectionProps) {
  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
        <p className='text-muted-foreground'>{desc}</p>
      </div>
      {children}
    </div>
  )
}
