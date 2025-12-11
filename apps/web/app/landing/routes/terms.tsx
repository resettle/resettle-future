import { Badge, Separator } from '@resettle/design'
import { Scale, Terminal } from 'lucide-react'
import { Link } from 'react-router'
import Metadata from '~/seo/components/Metadata'

export default function Terms() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden">
      <Metadata
        title="Terms of Use - Resettle"
        description="Terms of Use for Resettle Pte. Ltd., including API usage, data licensing, and user contributions."
        keywords={[
          'resettle terms of use',
          'api usage',
          'data licensing',
          'user contributions',
        ]}
      />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rotate-12 transform rounded-full bg-linear-to-br from-blue-300/60 via-cyan-300/50 to-blue-400/55 blur-3xl"></div>
        <div className="absolute -right-20 -bottom-20 h-80 w-80 -rotate-12 transform rounded-full bg-linear-to-tl from-amber-300/50 via-yellow-300/40 to-orange-300/45 blur-2xl"></div>
        <div className="absolute top-1/3 -left-20 h-72 w-72 rotate-45 transform rounded-full bg-linear-to-r from-blue-500/35 via-teal-400/45 to-cyan-500/40 blur-xl"></div>
        <div className="absolute top-1/4 -right-16 h-64 w-64 -rotate-30 transform rounded-full bg-linear-to-bl from-emerald-300/45 via-cyan-300/35 to-blue-300/40 blur-2xl"></div>
      </div>

      <div className="z-10 mx-auto w-full max-w-4xl px-4 py-20 sm:py-32">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm">
            <Scale className="mr-1.5 h-3.5 w-3.5" />
            Legal
          </Badge>
        </div>

        <div className="mb-12 text-center">
          <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
            Terms of Use
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none rounded-2xl bg-white/50 p-8 shadow-sm backdrop-blur-md dark:bg-slate-950/50">
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">General Disclaimer</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Resettle Pte. Ltd. ("Resettle", "we", or "us") provides this
              website and related services. By accessing or using our services,
              including our APIs and website, you agree to be bound by these
              Terms of Use.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              The structure of our project allows for data aggregation from
              various sources. While we strive for accuracy, nothing found here
              has necessarily been reviewed by people with the expertise
              required to provide you with complete, accurate, or reliable
              information. Use our content at your own risk.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We do not provide any warranties that our services will meet your
              requirements, be uninterrupted, timely, accurate, or error-free.
              Under no circumstances shall Resettle Pte. Ltd. be liable for any
              direct, indirect, incidental, special, consequential, or exemplary
              damages.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">Contributing Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              By contributing data to Resettle (including through our website
              forms, API submissions, or other means), you grant us a perpetual,
              irrevocable, worldwide, royalty-free, and non-exclusive license to
              use, reuse, reproduce, modify, adapt, publish, translate, create
              derivative works from, distribute, and display such data or any
              derivative work under this or another license at our discretion.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">Licensing of Content</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-xl font-semibold">1. Personal Use</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Use of Resettle data is free for personal use. If you use our
                  data in personal blogs, websites, or social media, you must
                  provide appropriate credit by including a link back to
                  Resettle.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  2. Academic & Media Use
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  The use of Resettle's content in newspapers, journals, books,
                  and academic works is permitted, provided that you give
                  appropriate credit. Appropriate credit is a citation and a
                  link back to the source page on Resettle.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  3. Commercial & API Use
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Commercial use of our data is primarily governed through our
                  API services. Companies and entities that purchase access to
                  our API (via RapidAPI or direct agreement) receive a license
                  to utilize Resettle data subject to the terms of their
                  specific subscription plan.
                </p>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">Prohibited Uses</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              You may not use, copy, reproduce, distribute, display, modify, or
              create derivative works based on Resettle's data or content unless
              explicitly permitted by these terms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Automated data collection methods</strong> (such as
              scraping, crawling, or spidering) of our website are strictly
              prohibited. Programmatic access to our data is available
              exclusively through our official APIs.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">API Terms</h2>
            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
              <div className="mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Terminal className="h-5 w-5" />
                <h3 className="font-semibold">Distributed via RapidAPI</h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Our APIs are distributed and managed through RapidAPI. By using
                our APIs, you agree to:
              </p>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                <li>RapidAPI's Terms of Service</li>
                <li>Resettle's specific API usage quotas and rate limits</li>
                <li>
                  Not to resell, redistribute, or sublicense the API data
                  directly
                </li>
                <li>
                  Not to use the API to build a competing product or service
                </li>
              </ul>
            </div>
          </section>

          <Separator className="my-8" />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your privacy is important to us. Please review our{' '}
              <Link
                to="/privacy"
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Privacy Policy
              </Link>{' '}
              to understand how we collect, use, and protect your information.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">DMCA & Copyright</h2>
            <p className="text-muted-foreground leading-relaxed">
              We respect the intellectual property rights of others. If you
              believe your work has been used on our website in a way that
              constitutes copyright infringement, please contact us with a
              description of the infringing material and your contact details.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">
              Disputes and Jurisdiction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Use shall be governed by and interpreted in
              accordance with the laws of Singapore. Any disputes arising from
              or related to these terms shall be subject to the exclusive
              jurisdiction of the courts of Singapore.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">Modifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              Resettle Pte. Ltd. reserves the right to modify these terms at any
              time. It is your responsibility to review this page periodically
              to stay informed of any updates.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
