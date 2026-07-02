import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Warm-neutral task surfaces (Insighter reference).

  One shared visual language for every task; only kicker/note copy varies.
  Renamed labels: listing → "Directory", sbm → "Signals".
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY = "'Didact Gothic', system-ui, -apple-system, sans-serif"
const BODY = "'Geist', system-ui, -apple-system, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#ffffff',
  surface: '#ffffff',
  raised: '#f7f4f2',
  text: '#282420',
  muted: '#987962',
  line: '#e3dad3',
  accent: '#f4e75a',
  accentSoft: '#feffd9',
  onAccent: '#282420',
  glow: 'rgba(244,231,90,0.35)',
  radius: '6px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Field notes', note: 'Long-reads, stories and reference material worth the scroll.' },
  listing: { ...base, kicker: 'Directory', note: 'Vetted places to work with, shop from, and quietly recommend.' },
  classified: { ...base, kicker: 'Exchange', note: 'Fresh offers surfacing across the network — act while they’re live.' },
  image: { ...base, kicker: 'Visuals', note: 'A curated feed of standout images and reference boards.' },
  sbm: { ...base, kicker: 'Signals', note: 'Hand-picked links from the community — the internet, without the noise.' },
  pdf: { ...base, kicker: 'Files', note: 'Downloadable guides, reports and reference PDFs.' },
  profile: { ...base, kicker: 'People', note: 'Operators, makers and builders you might want in your orbit.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
