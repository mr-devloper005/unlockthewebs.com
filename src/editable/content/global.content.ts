import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A working directory, plus curated signals',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Directory + curated signals',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Submit', href: '/contact' },
    },
  },
  footer: {
    tagline: 'A working directory, plus curated signals from the community.',
    description: 'A calmer front door for the network — pairing a reviewed directory with hand-picked links, resources, and reads worth your time.',
    columns: [
      {
        title: 'Discovery',
        links: [],
      },
      {
        title: 'Resources',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
    bottomNote: 'Built for connected discovery.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
