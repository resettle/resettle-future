import {
  index,
  layout,
  route,
  type RouteConfig,
} from '@react-router/dev/routes'

import { PAGE_ROUTES } from './common/routes'

export default [
  /**
   * SEO Routes
   */
  route('robots.txt', 'seo/routes/robots[.]txt.ts'),
  route('sitemap.xml', 'seo/routes/sitemap[.]xml.ts'),

  /**
   * Landing Page Routes
   */
  layout('common/components/NavigationLayout.tsx', [
    index('landing/routes/_index.tsx'),
    route(PAGE_ROUTES.dev.path, 'landing/routes/dev.tsx'),
  ]),

  /**
   * Auth Routes
   */
  route(PAGE_ROUTES.auth.signIn.path, 'auth/routes/auth.sign-in.tsx'),
  route(PAGE_ROUTES.auth.signOut.path, 'auth/routes/auth.sign-out.tsx'),

  /**
   * Legal Routes
   */
  route(PAGE_ROUTES.terms.path, 'landing/routes/terms.tsx'),
  route(PAGE_ROUTES.privacy.path, 'landing/routes/privacy.tsx'),
] satisfies RouteConfig
