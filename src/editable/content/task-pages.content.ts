import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Field notes',
    headline: 'Long-form reading with a calmer, warmer editorial rhythm.',
    description: 'Essays, guides, and stories worth setting aside twenty minutes for. Curated for depth, not for the scroll.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Reading surfaces need space, hierarchy, and fewer distractions.',
    chips: ['Editorial pacing', 'Topic filters', 'Reading-first'],
  },
  classified: {
    eyebrow: 'Exchange',
    headline: 'Time-sensitive offers, moving fast across the network.',
    description: 'Fresh classifieds surface here first — every entry is dated and de-duplicated so the top of the page always earns its spot.',
    filterLabel: 'Filter category',
    secondaryNote: 'Prioritize urgency, short summaries, and direct browsing.',
    chips: ['Fast scan', 'Fresh offers', 'Action cues'],
  },
  sbm: {
    eyebrow: 'Signals',
    headline: 'Hand-picked links from the community — the internet, without the noise.',
    description: 'Every entry is read by a real human before it lands here. No affiliate padding, no thin listicles — only links worth your click.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources with calm metadata and clear grouping.',
    chips: ['Human-curated', 'No affiliate padding', 'Weekly refresh'],
  },
  profile: {
    eyebrow: 'People',
    headline: 'Operators, makers and builders you might want in your orbit.',
    description: 'Discoverable profiles with the trust cues that matter — role, focus, and where to reach them.',
    filterLabel: 'Filter category',
    secondaryNote: 'Make identity and credibility visible before the grid begins.',
    chips: ['Identity-first', 'Trust cues', 'Direct contact'],
  },
  pdf: {
    eyebrow: 'Files',
    headline: 'Downloadable guides, reports and reference PDFs.',
    description: 'Documents presented as a working library — with previews, categories, and clean download links.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Document surfaces need archive cues, file context, and clear browsing.',
    chips: ['Documents', 'Reports', 'Reference'],
  },
  listing: {
    eyebrow: 'Directory',
    headline: 'A working directory of places to hire, buy from, and quietly recommend.',
    description: 'Every entry is reviewed before it publishes. Contact details verified in the last 90 days. Broken links get flagged in 48 hours.',
    filterLabel: 'Filter category',
    secondaryNote: 'Prioritize comparison, location, and a direct path to contact.',
    chips: ['Reviewed by an editor', 'Verified contacts', 'Community-flagged'],
  },
  image: {
    eyebrow: 'Visuals',
    headline: 'A curated feed of standout images and reference boards.',
    description: 'Gallery-first browsing for the visual side of the network.',
    filterLabel: 'Filter category',
    secondaryNote: 'Let images carry the page before long text does.',
    chips: ['Gallery-first', 'Boards', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
