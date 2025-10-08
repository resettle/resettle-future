import { useLoaderData } from 'react-router'

import { utmServerContext } from '~/analytics/contexts/utm.server'
import Metadata from '~/seo/components/Metadata'
import type { Route } from './+types/_index'

export async function loader({ context }: Route.LoaderArgs) {
  const utmParams = context.get(utmServerContext)

  return { utmParams }
}

export default function Index() {
  const { utmParams } = useLoaderData<typeof loader>()

  return (
    <div>
      <Metadata
        title="Resettle - The Opportunity Search Engine"
        description="Find your dream job, lifestyle and residency in your new country"
        keywords={['resettle', 'job', 'lifestyle', 'residency', 'opportunity']}
      />
      <pre>{JSON.stringify(utmParams, null, 2)}</pre>
    </div>
  )
}
