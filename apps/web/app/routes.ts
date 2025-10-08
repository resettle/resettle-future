import { index, route, type RouteConfig } from '@react-router/dev/routes'

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
  index('landing/routes/_index.tsx'),

  /**
   * Blog Routes
   */
  route(PAGE_ROUTES.blog.path, 'blog/routes/blog.tsx'),
  route(PAGE_ROUTES.blog.slug.path, 'blog/routes/blog.[slug].tsx'),
  route(PAGE_ROUTES.blog.page.page.path, 'blog/routes/blog.page.[page].tsx'),
  route(PAGE_ROUTES.blog.tag.tag.path, 'blog/routes/blog.tag.[tag].tsx'),

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
