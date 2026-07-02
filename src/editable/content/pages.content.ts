import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: `${slot4BrandConfig.siteName} — a working directory + curated signals`,
      description: 'A calmer front door for the network. Pairs a reviewed directory with hand-picked links worth your click.',
      openGraphTitle: `${slot4BrandConfig.siteName} — the network's warmer front door`,
      openGraphDescription: 'Reviewed directory records + community-curated signals in one calm feed.',
      keywords: ['directory', 'curated links', 'community picks', 'discovery', 'signals'],
    },
    hero: {
      badge: 'Welcome to the network',
      title: ['A working directory,', 'plus curated signals.'],
      description: `${slot4BrandConfig.siteName} pairs a reviewed directory with hand-picked links from the community — so discovery feels less like scrolling and more like sitting next to someone who already knows.`,
      primaryCta: { label: 'Browse the Directory', href: '/listings' },
      secondaryCta: { label: 'Read the Signals', href: '/sbm' },
      searchPlaceholder: 'Search entries, categories, and curated links',
      focusLabel: 'Focus',
      featureCardBadge: 'network cover rotation',
      featureCardTitle: 'The freshest entries shape the front page in real time.',
      featureCardDescription: 'New Directory records and Signals surface here without a manual refresh — no editorial gatekeeping beyond the initial review.',
    },
    intro: {
      badge: 'About the network',
      title: 'A calmer, warmer front door for the whole network.',
      paragraphs: [
        `${slot4BrandConfig.siteName} stitches directory records and community-curated signals into one calm feed — so discovery feels less like scrolling and more like reading the note a friend left.`,
        'Every Directory entry is reviewed by a real editor before it lands. Every Signal is read by a human before it ships. No affiliate padding. No dark patterns.',
        'Whether you start with a Directory record or a Signal, you can keep exploring without losing your place.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Reviewed Directory records — verified contacts, editor-checked details.',
        'Curated Signals — human-read, ranked by usefulness not by paid placement.',
        'Broken or stale links get flagged and removed within 48 hours.',
        'Free to explore, no paywall, no signup wall.',
      ],
      primaryLink: { label: 'Browse the Directory', href: '/listings' },
      secondaryLink: { label: 'Read the Signals', href: '/sbm' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Publish once. Reach every corner of the network.',
      description: `Add your place to the Directory or share a signal with the community — ${slot4BrandConfig.siteName} routes it to the readers who care.`,
      primaryCta: { label: 'Submit an entry', href: '/create' },
      secondaryCta: { label: 'Talk to us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest entries in this section.',
    },
  },
  about: {
    badge: 'Our story',
    title: 'A calmer, warmer way to discover the network.',
    description: `${slot4BrandConfig.siteName} is built to make a working directory feel useful and a curated feed of Signals feel like the note a friend left.`,
    paragraphs: [
      'The web is loud. Most discovery surfaces are optimized for engagement, not for you. We wanted something quieter — a place where every entry earned its spot and every link had been read by a human first.',
      'The Directory is a reviewed working record. The Signals are hand-picked links from the community. Together they make one warm front door.',
    ],
    values: [
      {
        title: 'Reviewed before it publishes',
        description: 'Every Directory record is checked by an editor. Every Signal is read by a human. No exceptions.',
      },
      {
        title: 'No affiliate padding',
        description: 'We rank by usefulness. Nothing gets promoted because someone paid to be there.',
      },
      {
        title: 'Fast to correct, fast to remove',
        description: 'Broken links, stale details, and community flags get acted on within 48 hours.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Talk to a real person. We route it to the right lane.',
    description: 'Tell us what you are trying to publish, fix, or launch. We will route it through the right lane instead of forcing every request into the same support bucket.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search Directory entries, Signals, and everything else across the network.',
    },
    hero: {
      badge: 'Search the network',
      title: 'Find entries, categories and curated links faster.',
      description: 'Use keywords, categories, and content types to discover posts from every active section.',
      placeholder: 'Search by keyword, topic, category, or title',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Submit',
      description: 'Submit a new entry for the network.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit a new entry.',
      description: 'Use your account to open the submission workspace and add a new entry for the active sections of the network.',
    },
    hero: {
      badge: 'Submission workspace',
      title: 'Submit an entry for the network.',
      description: 'Choose the type of entry, add details, and prepare a clean submission with images, links, summary, and body content.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit entry',
    successTitle: 'Entry submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to the network.',
      badge: 'Member access',
      title: 'Welcome back to the network.',
      description: 'Sign in to browse, manage your submissions, and contribute new entries from your account.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then sign in.',
      success: 'Signed in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an account on the network.',
      badge: 'Get started',
      title: 'Create your account and start contributing.',
      description: 'Create an account to open the submission workspace, save details, and share entries with the community.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related reads',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'More Directory entries',
      fallbackTitle: 'Directory entry details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
