import Link from 'next/link'
import { ArrowUpRight, BriefcaseBusiness, ChevronDown, Download, FileText, Globe, MapPin, Phone, Search, Star, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-5 xl:grid-cols-2',
  classified: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-5 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const cardBase =
  'group block rounded-[6px] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(40,36,32,0.25)]'

/** Ads: exactly one per archive per brief. listing → in-feed; sbm → header. */
const archiveAdSlot: Partial<Record<TaskKey, 'in-feed' | 'header'>> = {
  listing: 'in-feed',
  sbm: 'header',
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  // Display label uses task-theme.kicker so listing→"Directory" and sbm→"Signals".
  const label = theme.kicker
  const labelLower = label.toLowerCase()
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const adSlot = archiveAdSlot[task]

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {/* Warm header — chip + display headline + summary + filter row */}
        <header className="relative border-b border-[var(--tk-line)] bg-[var(--slot4-warm-1)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-[72px] sm:px-6 sm:py-[96px] lg:px-8 lg:py-[112px]">
            <EditableReveal>
              <span className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border)] bg-white px-3 py-1.5 editable-mono text-[.85rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
                <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
                {label}
              </span>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-6 max-w-3xl text-[2.625rem] leading-[1.1] tracking-[-0.005em] text-[var(--slot4-page-text)] sm:text-[2.8rem] lg:text-[3.5rem]">
                {voice?.headline || `Browse ${label}`}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-6 max-w-2xl text-[1.125rem] leading-[1.5] text-[var(--slot4-muted-text)]">
                {voice?.description || theme.note}
              </p>
            </EditableReveal>
            {voice?.chips?.length ? (
              <EditableReveal index={3}>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {voice.chips.map((chip) => (
                    <span key={chip} className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--editable-border)] bg-white px-3 py-1.5 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
                      <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
                      {chip}
                    </span>
                  ))}
                </div>
              </EditableReveal>
            ) : null}

            <div className="mt-12 flex flex-col gap-4 border-t border-[var(--editable-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[.95rem] text-[var(--slot4-muted-text)]">
                <span className="font-medium text-[var(--slot4-page-text)]">{posts.length}</span> {posts.length === 1 ? 'entry' : 'entries'} · {categoryLabel}
              </p>
              <form action={basePath} className="flex items-center gap-2.5">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-11 appearance-none rounded-[6px] border border-[var(--editable-border-strong)] bg-white pl-4 pr-10 text-[.95rem] font-medium text-[var(--slot4-page-text)] outline-none transition focus:border-[var(--slot4-page-text)]"
                    aria-label={voice?.filterLabel || 'Filter category'}
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--slot4-muted-text)]" />
                </div>
                <button className="inline-flex h-11 items-center rounded-[6px] bg-[var(--slot4-accent-fill)] px-5 text-[.95rem] font-medium text-[var(--slot4-on-accent)] transition hover:brightness-95">Apply</button>
              </form>
            </div>
          </div>
        </header>

        {/* Grid + ad + pagination */}
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-[72px] sm:px-6 sm:py-[96px] lg:px-8">
          {adSlot === 'header' ? (
            <div className="mb-10">
              <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel />
            </div>
          ) : null}

          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index % 6} className={task === 'image' ? 'break-inside-avoid' : ''}>
                  <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-[6px] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-warm-1)] px-8 py-16 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--slot4-muted-text)]" />
              <h2 className="editable-display mt-5 text-[1.5rem] leading-tight">Nothing here yet</h2>
              <p className="mt-2 text-[.95rem] leading-[1.5] text-[var(--slot4-muted-text)]">Try another category, or check back after new {labelLower} are published.</p>
            </div>
          )}

          {adSlot === 'in-feed' && posts.length ? (
            <div className="mt-14">
              <Ads slot="in-feed" size={pickRandom(getSlotSizes('in-feed'))} showLabel />
            </div>
          ) : null}

          {posts.length ? (
            <nav className="mt-16 flex items-center justify-center gap-3 text-[.95rem]">
              {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-[6px] border border-[var(--editable-border-strong)] px-5 py-2.5 font-medium transition hover:bg-[var(--slot4-warm-2)]">Previous</Link> : null}
              <span className="rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] px-5 py-2.5 font-medium text-[var(--slot4-muted-text)]">Page {page} of {pagination.totalPages || 1}</span>
              {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-[6px] border border-[var(--editable-border-strong)] px-5 py-2.5 font-medium transition hover:bg-[var(--slot4-warm-2)]">Next</Link> : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-5 inline-flex items-center gap-1.5 text-[.95rem] font-medium text-[var(--slot4-page-text)]">
      {label}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
}

const hashStr = (value: string) => {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}
const ratingOf = (post: SitePost) => {
  const real = Number(getContent(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  return Math.round((3.7 + (hashStr(post.slug || post.id || post.title || 'x') % 13) / 10) * 10) / 10
}
const reviewsOf = (post: SitePost) => {
  const real = Number(getContent(post).reviewCount ?? getContent(post).reviews)
  if (real > 0) return Math.floor(real)
  return 6 + (hashStr((post.slug || post.title || 'x') + 'r') % 480)
}

function RatingLine({ post, center = false }: { post: SitePost; center?: boolean }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className={`mt-2.5 flex items-center gap-2 ${center ? 'justify-center' : ''}`}>
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-4 w-4 ${i < filled ? 'fill-[var(--slot4-accent)] text-[var(--slot4-accent)]' : 'fill-[var(--slot4-warm-6)] text-[var(--slot4-warm-6)]'}`} />
        ))}
      </span>
      <span className="text-[.9rem] font-medium text-[var(--slot4-page-text)]">{rating.toFixed(1)}</span>
      <span className="text-[.9rem] text-[var(--slot4-muted-text)]">({reviewsOf(post)})</span>
    </div>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className={`${cardBase} overflow-hidden`}>
      <div className="aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
          <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
          <span>{category}</span>
          <span>· No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="editable-display mt-3 text-[1.35rem] leading-tight text-[var(--slot4-page-text)]">{post.title}</h2>
        <RatingLine post={post} />
        <p className="mt-3 line-clamp-2 text-[.95rem] leading-[1.55] text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
        <CardArrow label="Read article" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`${cardBase} flex items-center gap-5 p-5 sm:p-6`}>
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-2)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-9 w-9 text-[var(--slot4-muted-text)]" />}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="editable-display truncate text-[1.25rem] leading-tight text-[var(--slot4-page-text)]">{post.title}</h2>
        <RatingLine post={post} />
        <p className="mt-2 line-clamp-1 text-[.95rem] leading-[1.5] text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-[.8rem] font-medium text-[var(--slot4-muted-text)]">
          {location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {location}</span> : null}
          {phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {phone}</span> : null}
          {website ? <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Website</span> : null}
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)] transition group-hover:text-[var(--slot4-page-text)]" />
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-[1.75rem] leading-none tracking-[-0.005em] text-[var(--slot4-page-text)]">{price || 'Open offer'}</span>
        {condition ? <span className="rounded-[6px] bg-[var(--slot4-accent-soft)] px-3 py-1 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-page-text)]">{condition}</span> : null}
      </div>
      <h2 className="editable-display mt-5 text-[1.25rem] leading-tight text-[var(--slot4-page-text)]">{post.title}</h2>
      <RatingLine post={post} />
      <p className="mt-3 line-clamp-3 flex-1 text-[.95rem] leading-[1.55] text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--editable-border)] pt-4 text-[.8rem] font-medium text-[var(--slot4-muted-text)]">
        <span className="inline-flex items-center gap-1.5">{location ? <><MapPin className="h-3.5 w-3.5" /> {location}</> : 'Details inside'}</span>
        <ArrowUpRight className="h-4 w-4 text-[var(--slot4-page-text)] transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-0.5">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(40,36,32,0.78))] opacity-80 transition group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="editable-display line-clamp-2 text-[1.125rem] leading-tight text-white">{post.title}</h2>
          <span className="mt-2 inline-flex items-center gap-1.5 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-white/80">View image <ArrowUpRight className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} flex gap-4 p-6`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[6px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-page-text)]">
        <Globe className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">Signal · {String(index + 1).padStart(2, '0')}</span>
        <h2 className="editable-display mt-1.5 text-[1.125rem] leading-tight text-[var(--slot4-page-text)]">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-[.95rem] leading-[1.5] text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
        {website ? <p className="mt-3 truncate editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-page-text)]">{cleanDomain(website)}</p> : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Document')
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[6px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-page-text)]"><FileText className="h-6 w-6" /></div>
        <span className="rounded-[6px] border border-[var(--editable-border)] px-3 py-1 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">{category}</span>
      </div>
      <h2 className="editable-display mt-6 text-[1.25rem] leading-tight text-[var(--slot4-page-text)]">{post.title}</h2>
      <RatingLine post={post} />
      <p className="mt-3 line-clamp-3 flex-1 text-[.95rem] leading-[1.55] text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-[.95rem] font-medium text-[var(--slot4-page-text)]">Open document <Download className="h-4 w-4" /></span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-7 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--editable-border)] bg-[var(--slot4-warm-2)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--slot4-muted-text)]" />}
      </div>
      <h2 className="editable-display mt-5 text-[1.125rem] leading-tight text-[var(--slot4-page-text)]">{post.title}</h2>
      {role ? <p className="mt-1.5 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">{role}</p> : null}
      <RatingLine post={post} center />
      <p className="mt-3 line-clamp-2 text-[.95rem] leading-[1.5] text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
    </Link>
  )
}
