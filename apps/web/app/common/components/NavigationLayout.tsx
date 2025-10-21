import { Outlet } from 'react-router'

import Navigation from './Navigation'

export default function NavigationLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  )
}
