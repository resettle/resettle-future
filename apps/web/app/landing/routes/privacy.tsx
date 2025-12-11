import { Badge, Separator } from '@resettle/design'
import { Lock, Mail, ShieldCheck } from 'lucide-react'
import Metadata from '~/seo/components/Metadata'

export default function Privacy() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden">
      <Metadata
        title="Privacy Policy - Resettle"
        description="Privacy Policy for Resettle Pte. Ltd. detailing how we collect, use, and protect your personal information and data."
        keywords={[
          'resettle privacy policy',
          'privacy policy',
          'data protection',
          'data privacy',
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
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
            Privacy
          </Badge>
        </div>

        <div className="mb-12 text-center">
          <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
            Privacy Policy
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
            <h2 className="mb-4 text-2xl font-bold">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Resettle Pte. Ltd. ("Resettle", "we", "us"), we respect your
              privacy and are committed to protecting your personal data. This
              privacy policy will inform you as to how we look after your
              personal data when you visit our website or use our services
              (including our APIs) and tell you about your privacy rights.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">Information We Collect</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  1. Account Information
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you register for an account, we collect personal
                  identifiers such as your name, email address, and profile
                  information.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  2. Usage & API Data
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We collect technical data about your interaction with our
                  services, including IP addresses, browser types, and API usage
                  logs (endpoint calls, timestamps, response codes) to maintain
                  service stability and security.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  3. Payment Information
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use third-party payment processors (including RapidAPI for
                  API subscriptions) to handle payments. We do not store your
                  complete credit card information on our servers.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  4. User Contributions
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Data you voluntarily contribute to our platform (such as cost
                  of living inputs or place reviews) is stored and may be
                  publicly displayed in an aggregated or anonymized format.
                </p>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">
              How We Use Your Information
            </h2>
            <ul className="text-muted-foreground list-disc space-y-2 pl-5">
              <li>
                To provide and maintain our services, including API access
              </li>
              <li>To notify you about changes to our services</li>
              <li>To provide customer support</li>
              <li>To gather analysis so that we can improve our services</li>
              <li>
                To monitor the usage of our services and detect technical issues
              </li>
              <li>To prevent fraud and abuse</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">Third-Party Services</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We may employ third-party companies and individuals to facilitate
              our service ("Service Providers"), to provide the service on our
              behalf, or to assist us in analyzing how our service is used.
            </p>
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/30">
              <h3 className="mb-2 font-semibold">Key Providers Include:</h3>
              <ul className="text-muted-foreground list-disc space-y-1 pl-5">
                <li>
                  <strong>RapidAPI:</strong> For API distribution,
                  authentication, and billing
                </li>
                <li>
                  <strong>Cloud Infrastructure Providers:</strong> For hosting
                  and data storage
                </li>
                <li>
                  <strong>Analytics Services:</strong> To understand website
                  traffic and usage
                </li>
              </ul>
            </div>
          </section>

          <Separator className="my-8" />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to track the
              activity on our service and hold certain information. You can
              instruct your browser to refuse all cookies or to indicate when a
              cookie is being sent. However, if you do not accept cookies, you
              may not be able to use some portions of our service.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">Data Security</h2>
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  The security of your data is important to us, but remember
                  that no method of transmission over the Internet, or method of
                  electronic storage is 100% secure. While we strive to use
                  commercially acceptable means to protect your Personal Data,
                  we cannot guarantee its absolute security.
                </p>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">Your Data Rights</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Depending on your location, you may have the following rights
              regarding your personal data:
            </p>
            <ul className="text-muted-foreground grid gap-2 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                The right to access
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                The right to rectification
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                The right to erasure
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                The right to restrict processing
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                The right to data portability
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                The right to withdraw consent
              </li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">International Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information, including Personal Data, may be transferred to —
              and maintained on — computers located outside of your state,
              province, country, or other governmental jurisdiction where the
              data protection laws may differ than those from your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <div className="flex items-center gap-3 text-lg font-medium">
              <Mail className="h-5 w-5 text-blue-500" />
              <a
                href="mailto:support@resettle.ai"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                support@resettle.ai
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
