import { Button, Card, Input } from '@resettle/design'
import { ArrowRightIcon } from 'lucide-react'

import Metadata from '~/seo/components/Metadata'

export default function Index() {
  return (
    <main className="relative flex min-h-[calc(100svh-var(--spacing)*14)] flex-col items-center justify-center overflow-hidden">
      <Metadata
        title="Resettle - The Opportunity Search Engine"
        description="Find your dream job, lifestyle and residency in your new country"
        keywords={['resettle', 'job', 'lifestyle', 'residency', 'opportunity']}
      />
      <div className="fixed inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rotate-12 transform rounded-full bg-linear-to-br from-blue-300/60 via-cyan-300/50 to-blue-400/55 blur-3xl"></div>
        <div className="absolute -right-20 -bottom-20 h-80 w-80 -rotate-12 transform rounded-full bg-linear-to-tl from-amber-300/50 via-yellow-300/40 to-orange-300/45 blur-2xl"></div>
        <div className="absolute top-1/3 -left-20 h-72 w-72 rotate-45 transform rounded-full bg-linear-to-r from-blue-500/35 via-teal-400/45 to-cyan-500/40 blur-xl"></div>
        <div className="absolute top-1/4 -right-16 h-64 w-64 -rotate-30 transform rounded-full bg-linear-to-bl from-emerald-300/45 via-cyan-300/35 to-blue-300/40 blur-2xl"></div>
        <div className="absolute bottom-1/3 left-1/4 h-48 w-48 rotate-60 transform rounded-full bg-linear-to-tr from-pink-300/35 via-rose-300/30 to-orange-300/35 blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 h-32 w-96 -translate-x-1/2 -translate-y-1/2 rotate-12 transform rounded-full bg-linear-to-r from-blue-400/30 via-cyan-400/40 to-teal-400/35 blur-2xl"></div>
      </div>
      <div className="z-10 mx-auto flex flex-col items-center justify-center gap-6">
        <div>
          <h1 className="container mx-auto flex flex-col gap-2 text-center text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl">
            Your opportunities are waiting for you
          </h1>
          <h2 className="text-center text-lg">
            Join Today and Never Miss Out On a Life-Changing Opportunity Again
          </h2>
        </div>
        <Card className="border-border/60 bg-card/60 flex w-full max-w-lg flex-col gap-5 rounded-2xl border p-5 lg:max-w-3xl">
          <Input
            type="email"
            placeholder="Enter your email"
            className="bg-card"
            size="lg"
          />
          <Button size="lg">
            Join Waitlist
            <ArrowRightIcon />
          </Button>
        </Card>
      </div>
    </main>
  )
}
