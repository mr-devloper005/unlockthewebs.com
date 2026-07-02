import type { CSSProperties } from 'react'

/*
  Design contract — Insighter Consulting reference.

  Warm-neutral canvas with white surfaces, a deep warm shell (#282420) for
  navbar/footer/dark bands, lemon-yellow (#f4e75a) as the single hero accent.
  6px soft-corner buttons (not pills). Didact Gothic display + Geist body +
  Anonymous Pro badges.
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#ffffff',
  '--slot4-page-text': '#282420',
  '--slot4-panel-bg': '#f7f4f2',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-raised-bg': '#f3efec',
  '--slot4-warm-1': '#f7f4f2',
  '--slot4-warm-2': '#f3efec',
  '--slot4-warm-3': '#efeae6',
  '--slot4-warm-4': '#ebe5e0',
  '--slot4-warm-5': '#e7e0da',
  '--slot4-warm-6': '#e3dad3',
  '--slot4-warm-7': '#ddd2ca',
  '--slot4-warm-8': '#d7cac1',
  '--slot4-muted-text': '#987962',
  '--slot4-soft-muted-text': '#bfab9c',
  '--slot4-accent': '#f4e75a',
  '--slot4-accent-fill': '#f4e75a',
  '--slot4-accent-soft': '#feffd9',
  '--slot4-accent-strong': '#282420',
  '--slot4-accent-warm': '#f4e75a',
  '--slot4-on-accent': '#282420',
  '--slot4-dark-bg': '#282420',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#efeae6',
  '--slot4-cream': '#f7f4f2',
  '--slot4-warm': '#f7f4f2',
  '--slot4-lavender': '#feffd9',
  '--slot4-gray': '#f3efec',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#ffffff',
  '--editable-page-text': '#282420',
  '--editable-container': '1200px',
  '--editable-border': '#e3dad3',
  '--editable-border-strong': '#d7cac1',
  '--editable-nav-bg': '#282420',
  '--editable-nav-text': '#ffffff',
  '--editable-nav-active': '#f4e75a',
  '--editable-nav-active-text': '#282420',
  '--editable-cta-bg': '#f4e75a',
  '--editable-cta-text': '#282420',
  '--editable-search-bg': '#f7f4f2',
  '--editable-footer-bg': '#282420',
  '--editable-footer-text': '#ffffff',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  raisedBg: 'bg-[var(--slot4-raised-bg)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-page-text)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-page-text)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  borderStrong: 'border-[var(--editable-border-strong)]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[0_1px_2px_rgba(40,36,32,0.04)]',
  shadowStrong: 'shadow-[0_10px_30px_-15px_rgba(40,36,32,0.20)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(40,36,32,0)_0%,rgba(40,36,32,0.72)_100%)]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-[112px] sm:py-[128px] lg:py-[144px]',
    sectionYMd: 'py-[72px] sm:py-[84px] lg:py-[96px]',
    sectionYSm: 'py-[40px] sm:py-[44px] lg:py-[48px]',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-2 lg:items-center',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[300px] shrink-0 snap-start sm:w-[340px]',
  },
  type: {
    eyebrow:
      'editable-mono text-[.85rem] font-normal uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]',
    heroTitle:
      'editable-display text-[2.625rem] leading-[1.1] tracking-[-0.005em] text-[var(--slot4-dark-text)] sm:text-[2.8rem] lg:text-[3.5rem]',
    heroTitleLight:
      'editable-display text-[2.625rem] leading-[1.1] tracking-[-0.005em] text-[var(--slot4-page-text)] sm:text-[2.8rem] lg:text-[3.5rem]',
    sectionTitle:
      'editable-display text-[1.875rem] leading-[1.15] tracking-[-0.005em] text-[var(--slot4-page-text)] lg:text-[2.5rem]',
    sectionKicker:
      'editable-display text-[1.5rem] leading-[1.2] tracking-[-0.005em] text-[var(--slot4-page-text)] lg:text-[1.75rem]',
    body: 'text-[1.1rem] leading-[1.5] text-[var(--slot4-page-text)]',
    bodySm: 'text-base leading-[1.5] text-[var(--slot4-muted-text)]',
    emphasis: 'italic text-[var(--slot4-page-text)]',
  },
  surface: {
    card: `rounded-[6px] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[6px] border ${editablePalette.border} ${editablePalette.panelBg}`,
    warm: `rounded-[6px] bg-[var(--slot4-warm-2)]`,
    dark: `rounded-[6px] ${editablePalette.darkBg} ${editablePalette.darkText}`,
    glass: 'rounded-[6px] border border-white/15 bg-white/[0.06] backdrop-blur-md',
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-6 py-3 text-[.95rem] font-medium tracking-[0.01em] text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-95 active:scale-[0.98]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-[6px] border border-[var(--editable-border-strong)] bg-transparent px-6 py-3 text-[.95rem] font-medium tracking-[0.01em] text-[var(--slot4-page-text)] transition duration-300 hover:bg-[var(--slot4-warm-2)] active:scale-[0.98]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-6 py-3 text-[.95rem] font-medium text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-95 active:scale-[0.98]',
    onDark:
      'inline-flex items-center justify-center gap-2 rounded-[6px] border border-white/30 bg-transparent px-6 py-3 text-[.95rem] font-medium text-white transition duration-300 hover:bg-white/10 active:scale-[0.98]',
    ghost:
      'inline-flex items-center justify-center gap-2 rounded-[6px] px-4 py-2 text-[.95rem] font-medium text-[var(--slot4-muted-text)] transition duration-300 hover:text-[var(--slot4-page-text)]',
  },
  badge: {
    pill:
      'inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-2)] px-3 py-1.5 editable-mono text-[.75rem] font-normal uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]',
    accentPill:
      'inline-flex items-center gap-2 rounded-[6px] bg-[var(--slot4-accent-soft)] px-3 py-1.5 editable-mono text-[.75rem] font-normal uppercase tracking-[0.14em] text-[var(--slot4-page-text)]',
    darkPill:
      'inline-flex items-center gap-2 rounded-[6px] border border-white/15 bg-transparent px-3 py-1.5 editable-mono text-[.75rem] font-normal uppercase tracking-[0.14em] text-white',
  },
  media: {
    frame: 'relative overflow-hidden rounded-[6px] bg-[var(--slot4-media-bg)]',
    frameFull: 'relative overflow-hidden rounded-[6px] bg-[var(--slot4-media-bg)]',
    ratio: 'aspect-[4/3]',
    ratioWide: 'aspect-[16/9]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(40,36,32,0.25)]',
    fade: 'transition duration-500 hover:opacity-90',
    zoom: 'transition duration-700 group-hover:scale-[1.03]',
  },
} as const

export const aiLayoutRules = [
  'Foundation tokens live in editableRootStyle + editable-global.css. Every component reads from CSS vars, not hardcoded colors.',
  'Keep home structure in src/editable/sections/HomeSections.tsx.',
  'Wide readable grids; never skinny columns for paragraphs.',
  'Use horizontal rails for dense post browsing.',
  'Keep dynamic post fetching intact; never replace posts with mock arrays.',
  'Use postHref() for all post links.',
] as const
