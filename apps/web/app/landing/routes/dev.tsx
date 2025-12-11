import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@resettle/design'
import {
  ArrowRightIcon,
  BriefcaseIcon,
  CodeIcon,
  GlobeIcon,
  MapPinIcon,
  SearchIcon,
  SparklesIcon,
  TerminalIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import Metadata from '~/seo/components/Metadata'

export default function Developer() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden">
      <Metadata
        title="Resettle Developer APIs - Build with Global Data"
        description="Build powerful applications with access to global places and occupation data through Resettle APIs."
        keywords={[
          'resettle api',
          'developer api',
          'place api',
          'occupation api',
          'rapidapi',
        ]}
      />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rotate-12 transform rounded-full bg-linear-to-br from-blue-300/60 via-cyan-300/50 to-blue-400/55 blur-3xl"></div>
        <div className="absolute -right-20 -bottom-20 h-80 w-80 -rotate-12 transform rounded-full bg-linear-to-tl from-amber-300/50 via-yellow-300/40 to-orange-300/45 blur-2xl"></div>
        <div className="absolute top-1/3 -left-20 h-72 w-72 rotate-45 transform rounded-full bg-linear-to-r from-blue-500/35 via-teal-400/45 to-cyan-500/40 blur-xl"></div>
        <div className="absolute top-1/4 -right-16 h-64 w-64 -rotate-30 transform rounded-full bg-linear-to-bl from-emerald-300/45 via-cyan-300/35 to-blue-300/40 blur-2xl"></div>
      </div>

      {/* Hero Section */}
      <section className="z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 py-20 sm:py-32">
        <div className="mb-6 flex items-center gap-2">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm">
            <TerminalIcon className="mr-1.5 h-3.5 w-3.5" />
            Developer APIs
          </Badge>
        </div>

        <div className="mx-auto flex max-w-4xl flex-col gap-4 text-center">
          <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:text-6xl">
            Build powerful apps with{' '}
            <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              global intelligence
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl">
            Access detailed place data and standardized occupation codes to
            power your next generation of applications.
          </p>
        </div>
      </section>

      {/* API Cards Section */}
      <section className="z-10 mx-auto w-full max-w-7xl px-4 pb-20">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Place API Card */}
          <Card className="border-border/60 bg-card/60 flex flex-col backdrop-blur-sm">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <MapPinIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">Place API</CardTitle>
              <CardDescription className="text-base">
                Search and query detailed information about places worldwide
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h4 className="font-semibold">Key Features</h4>
                <ul className="text-muted-foreground grid gap-2 text-sm">
                  <li className="flex items-start gap-2">
                    <GlobeIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <span>
                      Search places by name, country code with fuzzy matching
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <SearchIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <span>
                      Cost of living data with multi-currency conversion
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <span>
                      Detailed location info including coordinates & population
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-auto pt-4">
                <Button asChild size="lg" className="w-full">
                  <a
                    href="https://rapidapi.com/resettle-resettle-default/api/resettle-place-api"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on RapidAPI
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Occupation API Card */}
          <Card className="border-border/60 bg-card/60 flex flex-col backdrop-blur-sm">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                <BriefcaseIcon className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <CardTitle className="text-2xl">Occupation API</CardTitle>
              <CardDescription className="text-base">
                Access standardized occupation codes and crosswalks
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h4 className="font-semibold">Key Features</h4>
                <ul className="text-muted-foreground grid gap-2 text-sm">
                  <li className="flex items-start gap-2">
                    <SearchIcon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                    <span>Search occupation codes with fuzzy matching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CodeIcon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                    <span>Query occupations by classification system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BriefcaseIcon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                    <span>
                      Crosswalk between different classification standards
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-auto pt-4">
                <Button asChild size="lg" className="w-full">
                  <a
                    href="https://rapidapi.com/resettle-resettle-default/api/resettle-occupation-api"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on RapidAPI
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="mx-auto w-full max-w-6xl" />

      {/* Technical Highlights */}
      <section className="z-10 mx-auto w-full max-w-7xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for developers
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Modern, reliable, and easy to integrate
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <TerminalIcon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-semibold">RESTful Design</h3>
            <p className="text-muted-foreground text-sm">
              Standard REST API principles for predictable interactions
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <CodeIcon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-semibold">JSON Responses</h3>
            <p className="text-muted-foreground text-sm">
              Clean, typed JSON responses for easy parsing
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <GlobeIcon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-semibold">OpenAPI Spec</h3>
            <p className="text-muted-foreground text-sm">
              Fully documented with OpenAPI specifications
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-semibold">RapidAPI Auth</h3>
            <p className="text-muted-foreground text-sm">
              Secure and easy authentication via RapidAPI platform
            </p>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <footer className="z-10 w-full pb-8 text-center">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
          <Link
            to="/terms"
            className="transition-colors hover:text-gray-900 hover:underline"
          >
            Terms of Service
          </Link>
          <span className="text-gray-400">·</span>
          <Link
            to="/privacy"
            className="transition-colors hover:text-gray-900 hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </main>
  )
}
