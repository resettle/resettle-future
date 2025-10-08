type MetadataProps = {
  title: string
  description: string
  keywords: string[]
}

export default function Metadata({
  title,
  description,
  keywords,
}: MetadataProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
    </>
  )
}
