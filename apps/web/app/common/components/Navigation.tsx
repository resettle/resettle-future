import { Button } from '@resettle/design'
import { ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router'

import Logo from './Logo'

export default function Navigation() {
  return (
    <div className="bg-card/80 sticky top-0 right-0 left-0 z-50 h-14 border-b backdrop-blur-md">
      <div className="container mx-auto flex h-full items-center justify-between gap-2 px-4">
        <Link aria-label="Go to Resettle" to="/">
          <Logo className="h-[20px] pr-1" />
        </Link>
        <Button>
          Get Started
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  )
}
