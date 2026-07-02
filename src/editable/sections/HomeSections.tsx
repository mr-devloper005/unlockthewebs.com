import Link from 'next/link'
import { ArrowUpRight, Bookmark, Building2, FileText, Image as ImageIcon, Megaphone, Search, Star, UserRound } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref, getEditableExcerpt } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { taskThemes } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: Megaphone,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: FileText,
  profile: UserRound,
}

function displayLabel(key: TaskKey) {
  return taskThemes[key]?.kicker || key
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

/* ============================================================
   HERO — full-bleed rounded media panel over dark warm shell,
   mono welcome badge, big display headline, CTA pair
   ============================================================ */
export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `Discover the best of ${SITE_CONFIG.name}`
  const cover = getEditablePostImage(dedupePosts(posts)[0])

  return (
    <section className="bg-[var(--slot4-dark-bg)] text-white">
      <div className={`${container} pb-[72px] pt-8 sm:pb-[96px] lg:pb-[112px]`}>
        <div className="relative overflow-hidden rounded-[6px]">
          <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(40,36,32,0.35)_0%,rgba(40,36,32,0.85)_100%)]" />
          <div className="relative min-h-[520px] px-6 py-16 sm:px-10 sm:py-24 lg:min-h-[640px] lg:px-16 lg:py-32">
            <EditableReveal>
              <span className="inline-flex items-center gap-2 rounded-[6px] border border-white/20 bg-white/[0.06] px-3 py-1.5 editable-mono text-[.85rem] uppercase tracking-[0.14em] text-white/85 backdrop-blur">
                <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
                {pagesContent.home.hero.badge || 'Welcome to the network'}
              </span>
            </EditableReveal>

            <EditableReveal index={1}>
              <h1 className={`mt-8 max-w-4xl ${dc.type.heroTitle}`}>
                {heroTitle}
              </h1>
            </EditableReveal>

            <EditableReveal index={2}>
              <p className="mt-6 max-w-2xl text-[1.1rem] leading-[1.5] text-white/85 lg:text-[1.25rem]">
                {pagesContent.home.hero.description}
              </p>
            </EditableReveal>

            <EditableReveal index={3}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href={pagesContent.home.hero.primaryCta?.href || primaryRoute} className={dc.button.primary}>
                  {pagesContent.home.hero.primaryCta?.label || `Browse ${displayLabel(primaryTask)}`}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/search" className={dc.button.onDark}>
                  <Search className="h-4 w-4" /> Search the network
                </Link>
              </div>
            </EditableReveal>
          </div>
        </div>

        {/* Floating action stack — sits under the hero panel */}
        <EditableReveal index={4}>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { title: 'Every listing verified', body: 'Only directory entries that passed our review get published.' },
              { title: 'Community-curated', body: 'Signals surface from readers, editors and operators — not bots.' },
              { title: 'Free to explore', body: 'No paywall, no dark patterns. Discovery-first from day one.' },
            ].map((f, i) => (
              <div key={i} className="rounded-[6px] border border-white/12 bg-white/[0.04] p-5">
                <p className="editable-display text-[1.125rem] text-white">{f.title}</p>
                <p className="mt-2 text-[1rem] leading-[1.5] text-white/70">{f.body}</p>
              </div>
            ))}
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

/* ============================================================
   WELCOME / TRUST — warm neutral band, centered intro,
   marquee of enabled section labels
   ============================================================ */
export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const rail = dedupePosts(posts).slice(0, 8)
  const enabled = SITE_CONFIG.tasks.filter((t) => t.enabled)

  return (
    <section className="bg-[var(--slot4-warm-1)]">
      <div className={`${container} ${dc.shell.sectionYMd}`}>
        <EditableReveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border)] bg-white px-3 py-1.5 editable-mono text-[.85rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
              <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
              Welcome to {SITE_CONFIG.name}
            </span>
            <h2 className={`mt-6 ${dc.type.sectionTitle}`}>
              A calmer, warmer front door for <span className="italic">the whole network</span>.
            </h2>
            <p className="mt-6 text-[1.125rem] leading-[1.5] text-[var(--slot4-muted-text)]">
              {SITE_CONFIG.name} pairs a working directory with community-curated signals — so discovery feels less like scrolling and more like reading the note a friend left.
            </p>
          </div>
        </EditableReveal>

        {/* Marquee-style label strip */}
        <EditableReveal index={1}>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-y border-[var(--editable-border)] py-6">
            {enabled.map((task) => {
              const Icon = taskIcon[task.key] || FileText
              return (
                <Link key={task.key} href={task.route} className="inline-flex items-center gap-2 editable-mono text-[.85rem] uppercase tracking-[0.16em] text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
                  <Icon className="h-4 w-4" /> {displayLabel(task.key)}
                </Link>
              )
            })}
          </div>
        </EditableReveal>

        {/* Post rail */}
        {rail.length ? (
          <>
            <div className="mt-16 flex items-end justify-between gap-6">
              <EditableReveal>
                <div className="max-w-2xl">
                  <p className={dc.type.eyebrow}>Now on {SITE_CONFIG.name}</p>
                  <h3 className={`mt-3 ${dc.type.sectionKicker}`}>The freshest signals, curated.</h3>
                </div>
              </EditableReveal>
              <EditableReveal index={1}>
                <Link href={primaryRoute} className="hidden items-center gap-1.5 text-[.95rem] font-medium text-[var(--slot4-page-text)] hover:opacity-70 sm:inline-flex">
                  See everything <ArrowUpRight className="h-4 w-4" />
                </Link>
              </EditableReveal>
            </div>
            <div className={`mt-8 ${dc.layout.rail}`}>
              {rail.map((post, i) => (
                <EditableReveal key={post.id || post.slug} index={i} className={dc.layout.minRailCard}>
                  <Link href={postHref(primaryTask, post, primaryRoute)} className={`group block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
                    <div className={`${dc.media.frame} ${dc.media.ratioWide}`}>
                      <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} loading="lazy" />
                    </div>
                    <div className="p-5">
                      <p className={dc.type.eyebrow}>{categoryOf(post) || displayLabel(primaryTask)}</p>
                      <h4 className="editable-display mt-2 line-clamp-3 text-[1.25rem] leading-tight text-[var(--slot4-page-text)]">{post.title}</h4>
                      <p className="mt-2 line-clamp-2 text-[.95rem] leading-[1.5] text-[var(--slot4-muted-text)]">
                        {getEditableExcerpt(post, 120)}
                      </p>
                    </div>
                  </Link>
                </EditableReveal>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}

/* ============================================================
   EXPERTISE / FEATURE — alternating image + text with highlight
   ============================================================ */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const feature = dedupePosts(posts)[0]
  if (!feature) return null
  const image = getEditablePostImage(feature)
  const steps = [
    { n: '01', label: 'Discover', body: 'Follow verified signals from every corner of the network.' },
    { n: '02', label: 'Compare', body: 'Side-by-side context, category tags, and community picks.' },
    { n: '03', label: 'Connect', body: 'Reach out, save for later, or route straight to the source.' },
  ]

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${container} ${dc.shell.sectionY}`}>
        <div className={dc.layout.featureGrid}>
          <EditableReveal>
            <div className="relative overflow-hidden rounded-[6px] border border-[var(--editable-border)]">
              <div className="aspect-[4/5]">
                <img src={image} alt={feature.title} className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgba(40,36,32,0.85)_100%)] p-6">
                <p className="editable-mono text-[.75rem] uppercase tracking-[0.14em] text-white/75">
                  Editor's pick · {displayLabel(primaryTask)}
                </p>
                <h3 className="editable-display mt-2 line-clamp-2 text-[1.25rem] leading-tight text-white">
                  {feature.title}
                </h3>
                <Link href={postHref(primaryTask, feature, primaryRoute)} className="mt-4 inline-flex items-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-4 py-2 text-[.9rem] font-medium text-[var(--slot4-on-accent)]">
                  Read entry <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </EditableReveal>

          <div>
            <EditableReveal>
              <span className={dc.badge.pill}>
                <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
                How the network works
              </span>
              <h2 className={`mt-6 ${dc.type.sectionTitle}`}>
                Move from a whisper to a <span className="italic">signal</span>.
              </h2>
              <p className="mt-6 max-w-lg text-[1.125rem] leading-[1.5] text-[var(--slot4-muted-text)]">
                {SITE_CONFIG.name} stitches directory records and community-curated signals into one calm feed — so discovery feels less like scrolling and more like sitting next to someone who already knows.
              </p>
            </EditableReveal>

            <div className="mt-10 grid gap-4">
              {steps.map((step, i) => (
                <EditableReveal key={step.n} index={i}>
                  <div className="flex items-start gap-6 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] p-6">
                    <span className="editable-display shrink-0 text-3xl text-[var(--slot4-page-text)]">{step.n}</span>
                    <div>
                      <p className="editable-display text-[1.25rem] text-[var(--slot4-page-text)]">{step.label}</p>
                      <p className="mt-1.5 text-[1rem] leading-[1.5] text-[var(--slot4-muted-text)]">{step.body}</p>
                    </div>
                  </div>
                </EditableReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   TIME COLLECTIONS — alternating warm bands, 3–4 col grids
   ============================================================ */
const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'Fresh this week', title: 'New signals, last 7 days' },
  browse: { eyebrow: 'Trending now', title: 'Rising across the network' },
  index: { eyebrow: 'Evergreen', title: 'From the archive' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((s) => s.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, idx) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
        const bg = idx % 2 === 0 ? 'bg-[var(--slot4-warm-1)]' : 'bg-[var(--slot4-page-bg)]'
        return (
          <section key={section.key} className={bg}>
            <div className={`${container} ${dc.shell.sectionYMd}`}>
              <div className="flex items-end justify-between gap-4">
                <EditableReveal>
                  <div>
                    <p className={dc.type.eyebrow}>{copy.eyebrow}</p>
                    <h2 className={`mt-3 ${dc.type.sectionKicker}`}>{copy.title}</h2>
                  </div>
                </EditableReveal>
                <EditableReveal index={1}>
                  <Link href={section.href || primaryRoute} className="inline-flex shrink-0 items-center gap-1.5 text-[.95rem] font-medium text-[var(--slot4-page-text)] hover:opacity-70">
                    See all <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </EditableReveal>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, i) => (
                  <EditableReveal key={post.id || post.slug} index={i}>
                    <CompactCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  </EditableReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

function CompactCard({ post, href }: { post: SitePost; href: string }) {
  const category = categoryOf(post)
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className={`group flex h-full flex-col overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} ${dc.media.ratioWide}`}>
        <img src={image} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} loading="lazy" />
        {category ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-[6px] bg-white/95 px-2.5 py-1 editable-mono text-[.7rem] uppercase tracking-[0.14em] text-[var(--slot4-page-text)]">
            <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
            {category}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="editable-display line-clamp-2 text-[1.125rem] leading-tight text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-2 flex-1 text-[.95rem] leading-[1.55] text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 110)}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[.85rem] font-medium text-[var(--slot4-page-text)] group-hover:opacity-70">
          <Star className="h-3.5 w-3.5 fill-[var(--slot4-accent)] text-[var(--slot4-accent)]" />
          Open
        </span>
      </div>
    </Link>
  )
}

/* ============================================================
   CTA — dark warm strip with lemon accent line
   ============================================================ */
export function EditableHomeCta() {
  return (
    <section id="get-app" className="bg-[var(--slot4-dark-bg)] text-white">
      <div className={`${container} ${dc.shell.sectionY}`}>
        <EditableReveal>
          <div className="relative overflow-hidden rounded-[6px] border border-white/12 bg-[linear-gradient(135deg,rgba(244,231,90,0.10),transparent_60%)] p-10 sm:p-16 lg:p-20">
            <span className="inline-flex items-center gap-2 rounded-[6px] border border-white/20 bg-white/[0.04] px-3 py-1.5 editable-mono text-[.85rem] uppercase tracking-[0.14em] text-white/85">
              <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
              {pagesContent.home.cta.badge || 'Start exploring'}
            </span>
            <h2 className={`mt-6 max-w-3xl ${dc.type.heroTitle}`}>
              {pagesContent.home.cta.title}
            </h2>
            <p className="mt-6 max-w-xl text-[1.125rem] leading-[1.5] text-white/75">
              {pagesContent.home.cta.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={pagesContent.home.cta.primaryCta.href} className={dc.button.primary}>
                {pagesContent.home.cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href={pagesContent.home.cta.secondaryCta.href} className={dc.button.onDark}>
                {pagesContent.home.cta.secondaryCta.label}
              </Link>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}
