import { Link } from 'react-router'

import Metadata from '~/seo/components/Metadata'

export default function Index() {
  return (
    <main className="relative -mt-14 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white">
      <Metadata
        title="Resettle - The World AI for Superindividuals"
        description="The most powerful AI agent for superindividuals to find the best opportunities around the world. Coming soon."
        keywords={['resettle', 'superindividual', 'ai', 'coming soon']}
      />

      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rotate-12 transform rounded-full bg-linear-to-br from-blue-300/60 via-cyan-300/50 to-blue-400/55 blur-3xl"></div>
        <div className="absolute -right-20 -bottom-20 h-80 w-80 -rotate-12 transform rounded-full bg-linear-to-tl from-amber-300/50 via-yellow-300/40 to-orange-300/45 blur-2xl"></div>
        <div className="absolute top-1/3 -left-20 h-72 w-72 rotate-45 transform rounded-full bg-linear-to-r from-blue-500/35 via-teal-400/45 to-cyan-500/40 blur-xl"></div>
        <div className="absolute top-1/4 -right-16 h-64 w-64 -rotate-30 transform rounded-full bg-linear-to-bl from-emerald-300/45 via-cyan-300/35 to-blue-300/40 blur-2xl"></div>
        <div className="absolute bottom-1/3 left-1/4 h-48 w-48 rotate-60 transform rounded-full bg-linear-to-tr from-pink-300/35 via-rose-300/30 to-orange-300/35 blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 h-32 w-96 -translate-x-1/2 -translate-y-1/2 rotate-12 transform rounded-full bg-linear-to-r from-blue-400/30 via-cyan-400/40 to-teal-400/35 blur-2xl"></div>
      </div>

      <div className="z-10 flex flex-col items-center gap-8">
        <h1 className="font-display text-6xl font-bold tracking-tighter text-black sm:text-8xl">
          Coming Soon
        </h1>

        <p className="max-w-lg text-lg font-light tracking-wide sm:text-xl">
          We're building the most powerful AI agent for superindividuals to find
          the best opportunities around the world.
        </p>
      </div>

      {/* Footer Links */}
      <footer className="z-10 mt-8 py-8">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
          <Link
            to="/dev"
            className="transition-colors hover:text-gray-900 hover:underline"
          >
            Developer APIs
          </Link>
          <span className="text-gray-400">·</span>
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
