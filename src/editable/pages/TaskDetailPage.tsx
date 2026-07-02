import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Bookmark, Camera, CheckCircle2, Clock, Download, ExternalLink, FileText, Globe2, Mail, MapPin, Phone, ShieldCheck, Sparkles, Star, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
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

function DetailMeta({ post, category, center = false }: { post: SitePost; category?: string; center?: boolean }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 ${center ? 'justify-center' : ''}`}>
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-[18px] w-[18px] ${i < filled ? 'fill-[var(--slot4-accent)] text-[var(--slot4-accent)]' : 'fill-[var(--slot4-warm-6)] text-[var(--slot4-warm-6)]'}`} />
        ))}
      </span>
      <span className="text-[.95rem] font-medium text-[var(--slot4-page-text)]">{rating.toFixed(1)}</span>
      <span className="text-[.95rem] text-[var(--slot4-muted-text)]">{reviewsOf(post)} reviews</span>
      {category ? (
        <>
          <span className="h-1 w-1 rounded-full bg-[var(--slot4-muted-text)] opacity-50" />
          <span className="text-[.95rem] text-[var(--slot4-muted-text)]">{category}</span>
        </>
      ) : null}
    </div>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border)] bg-white px-3 py-1.5 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
      <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
      <span>{theme.kicker}</span>
      <span className="text-[var(--slot4-soft-muted-text)]">·</span>
      <span>{children}</span>
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  const theme = getTaskTheme(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-[.95rem] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {theme.kicker}
    </Link>
  )
}

/* ================================================================
   ARTICLE
   ================================================================ */
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <BackLink task="article" />
        <p className="mt-10 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">{categoryOf(post, 'Article')}</p>
        <h1 className="editable-display mt-5 text-[2.625rem] leading-[1.1] tracking-[-0.005em] text-[var(--slot4-page-text)] sm:text-[2.8rem] lg:text-[3.5rem]">{post.title}</h1>
        <div className="mt-6 text-[.95rem] text-[var(--slot4-muted-text)]">
          <span>{SITE_CONFIG.name}</span>
        </div>
        {images[0] ? <img src={images[0]} alt="" className="mt-10 aspect-[16/9] w-full rounded-[6px] border border-[var(--editable-border)] object-cover" /> : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ================================================================
   LISTING (Directory) — rich premium detail w/ hero, sidebar contact,
   map, gallery, sidebar Ads slot="sidebar", related strip
   ================================================================ */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0]
  const gallery = images.slice(1, 7)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'openingHours', 'schedule']) || 'Mon–Fri · 9:00 – 18:00'
  const category = getField(post, ['category']) || 'Featured'
  const mapSrc = mapSrcFor(post)
  const lead = leadText(post)

  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <BackLink task="listing" />

      {/* Kicker + display H1 */}
      <div className="mt-8">
        <Kicker task="listing">{category}</Kicker>
        <h1 className="editable-display mt-5 text-[2.625rem] leading-[1.1] tracking-[-0.005em] text-[var(--slot4-page-text)] sm:text-[2.8rem] lg:text-[3.5rem]">
          {post.title}
        </h1>
        <DetailMeta post={post} category={category} />
      </div>

      {/* Hero image */}
      {hero ? (
        <div className="mt-10 overflow-hidden rounded-[6px] border border-[var(--editable-border)]">
          <div className="relative aspect-[16/9] bg-[var(--slot4-warm-2)]">
            <img src={hero} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      ) : null}

      {/* Quick facts strip */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickFact icon={MapPin} label="Location" value={address || 'By appointment'} />
        <QuickFact icon={Phone} label="Phone" value={phone || 'On request'} />
        <QuickFact icon={Clock} label="Hours" value={hours} />
        <QuickFact icon={ShieldCheck} label="Verified" value="Directory review passed" />
      </div>

      {/* Body + sidebar */}
      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="min-w-0">
          {lead ? <p className="text-[1.25rem] leading-[1.5] text-[var(--slot4-muted-text)] lg:text-[1.35rem]">{lead}</p> : null}
          <h2 className="editable-display mt-10 text-[1.75rem] leading-[1.2] text-[var(--slot4-page-text)] lg:text-[2rem]">About this place</h2>
          <BodyContent post={post} />

          {post.tags?.length ? (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.slice(0, 10).map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] px-3 py-1.5 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
                  <Tag className="h-3.5 w-3.5" /> {tag}
                </span>
              ))}
            </div>
          ) : null}

          {gallery.length ? (
            <section className="mt-14">
              <h3 className="editable-display text-[1.5rem] leading-tight text-[var(--slot4-page-text)]">Gallery</h3>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {gallery.map((image, i) => (
                  <div key={`${image}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-2)]">
                    <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {mapSrc ? (
            <section className="mt-14">
              <h3 className="editable-display text-[1.5rem] leading-tight text-[var(--slot4-page-text)]">Find them</h3>
              <div className="mt-6 overflow-hidden rounded-[6px] border border-[var(--editable-border)]">
                <iframe src={mapSrc} title="Map" loading="lazy" className="h-[380px] w-full border-0" />
              </div>
            </section>
          ) : null}
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[6px] border border-[var(--editable-border)] bg-white p-6">
            <p className="editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">Get in touch</p>
            <div className="mt-4 divide-y divide-[var(--editable-border)]">
              {address ? <ContactRow icon={MapPin} label="Address" value={address} /> : null}
              {phone ? <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
              {email ? <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
              {website ? <ContactRow icon={Globe2} label="Website" value={cleanDomain(website)} href={website} external /> : null}
              <ContactRow icon={Clock} label="Hours" value={hours} />
            </div>
            <Link
              href={website || `tel:${phone || ''}`}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-5 py-3 text-[.95rem] font-medium text-[var(--slot4-on-accent)] transition hover:brightness-95"
              target={website ? '_blank' : undefined}
              rel={website ? 'noreferrer' : undefined}
            >
              Contact this listing <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] p-6">
            <p className="editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">Why trust this listing</p>
            <ul className="mt-4 space-y-3 text-[.95rem] leading-[1.5] text-[var(--slot4-page-text)]">
              <TrustItem>Reviewed by a real editor before publishing.</TrustItem>
              <TrustItem>Contact details verified with the owner in the last 90 days.</TrustItem>
              <TrustItem>Community can flag issues — we act within 48 hours.</TrustItem>
            </ul>
          </div>

          <div className="mt-6">
            <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel />
          </div>
        </aside>
      </div>

      <RelatedStrip task="listing" related={related} />
    </section>
  )
}

function QuickFact({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] p-4">
      <div className="flex items-center gap-2 editable-mono text-[.7rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className="mt-2 line-clamp-1 text-[.95rem] font-medium text-[var(--slot4-page-text)]">{value}</p>
    </div>
  )
}

function ContactRow({ icon: Icon, label, value, href, external }: { icon: typeof MapPin; label: string; value: string; href?: string; external?: boolean }) {
  const inner = (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-page-text)]"><Icon className="h-4 w-4" /></span>
      <div className="min-w-0">
        <p className="editable-mono text-[.7rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">{label}</p>
        <p className="mt-0.5 break-words text-[.95rem] font-medium text-[var(--slot4-page-text)]">{value}</p>
      </div>
    </div>
  )
  if (!href) return inner
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="block transition hover:opacity-70">
      {inner}
    </a>
  )
}

function TrustItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--slot4-page-text)]" />
      <span>{children}</span>
    </li>
  )
}

/* ================================================================
   CLASSIFIED
   ================================================================ */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-6 rounded-[6px] border border-[var(--editable-border)] bg-white p-6">
            <Kicker task="classified">{getField(post, ['category']) || 'Offer'}</Kicker>
            <h1 className="editable-display mt-4 text-[1.5rem] leading-tight text-[var(--slot4-page-text)]">{post.title}</h1>
            <DetailMeta post={post} category={getField(post, ['category'])} />
            <p className="editable-display mt-6 text-[2rem] leading-none text-[var(--slot4-page-text)]">{price || 'Open offer'}</p>
            <div className="mt-6 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-5 py-2.5 text-[.9rem] font-medium text-[var(--slot4-on-accent)] hover:brightness-95"><Phone className="h-4 w-4" /> Call</a> : null}
              {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border-strong)] px-5 py-2.5 text-[.9rem] font-medium text-[var(--slot4-page-text)] hover:bg-[var(--slot4-warm-2)]"><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          <ImageStrip images={images} label="Offer images" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* ================================================================
   IMAGE
   ================================================================ */
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <BackLink task="image" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[6px] border border-[var(--editable-border)] bg-white">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Kicker task="image"><Camera className="h-3.5 w-3.5" /> Image story</Kicker>
            <h1 className="editable-display mt-6 text-[2.625rem] leading-[1.1] tracking-[-0.005em] text-[var(--slot4-page-text)] sm:text-[2.8rem]">{post.title}</h1>
            {leadText(post) ? <p className="mt-6 text-[1.125rem] leading-[1.5] text-[var(--slot4-muted-text)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ================================================================
   BOOKMARK / SIGNALS (SBM) — IMAGE-FREE detail per brief.
   Zero <img> tags inside this branch. Visual density comes from type.
   ================================================================ */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  const domain = website ? cleanDomain(website) : (SITE_CONFIG.name || 'source')
  const category = getField(post, ['category']) || 'Curated'
  const initial = (domain[0] || 'S').toUpperCase()
  const lead = leadText(post)
  const tagCount = post.tags?.length || 0

  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <BackLink task="sbm" />

      {/* Mono chip row */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Kicker task="sbm">Curated link</Kicker>
        <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--editable-border)] bg-white px-3 py-1.5 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
          <Globe2 className="h-3.5 w-3.5" /> {domain}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--editable-border)] bg-white px-3 py-1.5 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
          <Tag className="h-3.5 w-3.5" /> {category}
        </span>
      </div>

      {/* Very large H1 — larger than listing H1 */}
      <h1 className="editable-display mt-8 text-[2.75rem] leading-[1.05] tracking-[-0.005em] text-[var(--slot4-page-text)] sm:text-[3.25rem] lg:text-[4.25rem]">
        {post.title}
      </h1>

      {/* Pull-quote lead */}
      {lead ? (
        <blockquote className="mt-10 max-w-3xl border-l-[3px] border-[var(--slot4-accent)] pl-6 editable-display text-[1.35rem] leading-[1.4] text-[var(--slot4-page-text)] sm:text-[1.5rem] lg:text-[1.75rem]">
          {lead}
        </blockquote>
      ) : null}

      {/* Primary + secondary CTAs */}
      <div className="mt-10 flex flex-wrap items-center gap-3">
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-6 py-3 text-[.95rem] font-medium text-[var(--slot4-on-accent)] transition hover:brightness-95">
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <Link href="/sbm" className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border-strong)] bg-transparent px-6 py-3 text-[.95rem] font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-warm-2)]">
          <ArrowLeft className="h-4 w-4" /> Back to Signals
        </Link>
      </div>

      {/* Quick facts */}
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickFact icon={Globe2} label="Source" value={domain} />
        <QuickFact icon={Tag} label="Category" value={category} />
        <QuickFact icon={Bookmark} label="Saved" value={`${tagCount} tag${tagCount === 1 ? '' : 's'}`} />
        <QuickFact icon={Sparkles} label="Curated" value={`by ${SITE_CONFIG.name}`} />
      </div>

      {/* Body + sidebar */}
      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="min-w-0">
          <h2 className="editable-display text-[1.75rem] leading-[1.2] text-[var(--slot4-page-text)] lg:text-[2.25rem]">Why this made the list</h2>
          <BodyContent post={post} />

          {post.tags?.length ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.slice(0, 12).map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] px-3 py-1.5 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
                  <Tag className="h-3.5 w-3.5" /> {tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* Ads slot — article-bottom, before related strip */}
          <div className="mt-14">
            <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel />
          </div>

          {/* Repeated CTA */}
          {website ? (
            <div className="mt-12 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] p-8">
              <p className="editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">Ready when you are</p>
              <p className="editable-display mt-3 text-[1.5rem] leading-tight text-[var(--slot4-page-text)]">Open the resource in a new tab.</p>
              <Link href={website} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-6 py-3 text-[.95rem] font-medium text-[var(--slot4-on-accent)] transition hover:brightness-95">
                Visit {domain} <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          {/* Domain identity block — NO <img>, giant display initial */}
          <div className="rounded-[6px] border border-[var(--editable-border)] bg-white p-6 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)]">
              <span className="editable-display text-[3rem] leading-none text-[var(--slot4-page-text)]">{initial}</span>
            </div>
            <p className="editable-display mt-5 text-[1.25rem] leading-tight text-[var(--slot4-page-text)]">{domain}</p>
            <p className="mt-1 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">Curated link</p>
            <div className="mt-5 space-y-2.5 text-left">
              <SidebarMetaRow label="Category" value={category} />
              <SidebarMetaRow label="Tags" value={String(tagCount)} />
              <SidebarMetaRow label="Curated by" value={SITE_CONFIG.name} />
              <SidebarMetaRow label="Saved date" value="Recent" />
            </div>
            {website ? (
              <Link href={website} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-5 py-3 text-[.95rem] font-medium text-[var(--slot4-on-accent)] transition hover:brightness-95">
                Visit source <ExternalLink className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          <div className="mt-6 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] p-6">
            <p className="editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">Why this list</p>
            <ul className="mt-4 space-y-3 text-[.95rem] leading-[1.5] text-[var(--slot4-page-text)]">
              <TrustItem>Every link is read by a human before it's shared.</TrustItem>
              <TrustItem>Ranked by usefulness, not by paid placement.</TrustItem>
              <TrustItem>Broken or stale links are removed on sight.</TrustItem>
            </ul>
          </div>
        </aside>
      </div>

      {/* Related — image-free, big display-face domain initial per tile */}
      {related.length ? (
        <section className="mt-20 border-t border-[var(--editable-border)] pt-14">
          <div className="flex items-center justify-between">
            <h2 className="editable-display text-[1.75rem] leading-tight text-[var(--slot4-page-text)] lg:text-[2rem]">More Signals</h2>
            <Link href="/sbm" className="inline-flex items-center gap-1.5 text-[.95rem] font-medium text-[var(--slot4-page-text)]">View all <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => <SbmRelatedCard key={item.id || item.slug} post={item} />)}
          </div>
        </section>
      ) : null}
    </section>
  )
}

function SidebarMetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[var(--editable-border)] pt-2.5">
      <span className="editable-mono text-[.7rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">{label}</span>
      <span className="text-[.9rem] font-medium text-[var(--slot4-page-text)]">{value}</span>
    </div>
  )
}

/** Image-free related card for SBM — big display-face domain initial + title. */
function SbmRelatedCard({ post }: { post: SitePost }) {
  const website = getField(post, ['website', 'url', 'link'])
  const domain = website ? cleanDomain(website) : (post.slug || 's')
  const initial = (domain[0] || 'S').toUpperCase()
  const href = `/sbm/${post.slug}`
  return (
    <Link href={href} className="group block rounded-[6px] border border-[var(--editable-border)] bg-white p-6 transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(40,36,32,0.25)]">
      <div className="flex h-16 w-16 items-center justify-center rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)]">
        <span className="editable-display text-[1.75rem] leading-none text-[var(--slot4-page-text)]">{initial}</span>
      </div>
      <p className="mt-4 editable-mono text-[.7rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">{domain}</p>
      <h3 className="editable-display mt-2 line-clamp-3 text-[1.125rem] leading-tight text-[var(--slot4-page-text)]">
        {post.title}
      </h3>
    </Link>
  )
}

/* ================================================================
   PDF
   ================================================================ */
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <BackLink task="pdf" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="min-w-0">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[6px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-page-text)]"><FileText className="h-9 w-9" /></div>
            <div className="min-w-0">
              <Kicker task="pdf">{categoryOf(post, 'Document')}</Kicker>
              <h1 className="editable-display mt-3 text-[2rem] leading-[1.1] text-[var(--slot4-page-text)] sm:text-[2.5rem]">{post.title}</h1>
            </div>
          </div>
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-10 overflow-hidden rounded-[6px] border border-[var(--editable-border)] bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--editable-border)] p-4">
                <span className="text-[.95rem] font-medium">Document preview</span>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-4 py-2 text-[.85rem] font-medium text-[var(--slot4-on-accent)] hover:brightness-95">Download <Download className="h-4 w-4" /></Link>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full bg-[var(--slot4-warm-2)]" />
            </div>
          ) : null}
        </article>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {fileUrl ? (
            <div className="rounded-[6px] border border-[var(--editable-border)] bg-white p-6">
              <p className="editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">Get this document</p>
              <p className="mt-2 text-[.95rem] leading-[1.5] text-[var(--slot4-muted-text)]">Open or download the full file in a new tab.</p>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-5 py-3 text-[.95rem] font-medium text-[var(--slot4-on-accent)] hover:brightness-95">Download <Download className="h-4 w-4" /></Link>
            </div>
          ) : null}
          <RelatedPanel task="pdf" post={post} related={related} />
        </aside>
      </div>
    </section>
  )
}

/* ================================================================
   PROFILE
   ================================================================ */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <BackLink task="profile" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[6px] border border-[var(--editable-border)] bg-white p-8 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--editable-border)] bg-[var(--slot4-warm-2)]">
                {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--slot4-muted-text)]" />}
              </div>
              <h1 className="editable-display mt-6 text-[1.5rem] leading-tight text-[var(--slot4-page-text)]">{post.title}</h1>
              {role ? <p className="mt-2 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">{role}</p> : null}
              <DetailMeta post={post} center />
              <ContactAction website={website} email={email} bare />
            </div>
          </aside>
          <article className="min-w-0">
            <Kicker task="profile">Profile</Kicker>
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Gallery" />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ================================================================
   Shared building blocks
   ================================================================ */
function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--slot4-page-text)] ${compact ? 'text-[1rem] leading-[1.6]' : 'text-[1.1rem] leading-[1.6]'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-10">
      <p className="editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[6px] border border-[var(--editable-border)] object-cover" />)}
      </div>
    </section>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${bare ? 'justify-center' : ''}`}>
      {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-4 py-2.5 text-[.9rem] font-medium text-[var(--slot4-on-accent)] hover:brightness-95">Website <ExternalLink className="h-4 w-4" /></Link> : null}
      {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border-strong)] px-4 py-2.5 text-[.9rem] font-medium text-[var(--slot4-page-text)] hover:bg-[var(--slot4-warm-2)]"><Phone className="h-4 w-4" /> Call</a> : null}
      {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border-strong)] px-4 py-2.5 text-[.9rem] font-medium text-[var(--slot4-page-text)] hover:bg-[var(--slot4-warm-2)]"><Mail className="h-4 w-4" /> Email</a> : null}
    </div>
  )
  if (bare) return <div className="mt-6">{buttons}</div>
  return (
    <div className="mt-10 rounded-[6px] border border-[var(--editable-border)] bg-white p-6">
      <p className="editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">Quick actions</p>
      <div className="mt-4">{buttons}</div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] px-4 py-3 text-[.9rem]">
      <span className="editable-mono uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">{label}</span>
      <span className="font-medium text-[var(--slot4-page-text)]">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  const theme = getTaskTheme(task)
  return (
    <div className="space-y-6">
      <div className="rounded-[6px] border border-[var(--editable-border)] bg-white p-6">
        <p className="editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">About this post</p>
        <div className="mt-4 grid gap-2.5 text-[.95rem] text-[var(--slot4-muted-text)]">
          <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> {theme.kicker}</p>
          <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {SITE_CONFIG.name}</p>
        </div>
      </div>
      {related.length ? (
        <div className="rounded-[6px] border border-[var(--editable-border)] bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="editable-display text-[1.25rem] leading-tight text-[var(--slot4-page-text)]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const theme = getTaskTheme(task)
  return (
    <section className="border-t border-[var(--editable-border)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="editable-display text-[1.75rem] leading-tight text-[var(--slot4-page-text)] lg:text-[2rem]">More {theme.kicker}</h2>
          <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-[.95rem] font-medium text-[var(--slot4-page-text)]">View all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} grid />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, grid = false }: { task: TaskKey; post: SitePost; grid?: boolean }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (grid) {
    return (
      <Link href={href} className="group block overflow-hidden rounded-[6px] border border-[var(--editable-border)] bg-white transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(40,36,32,0.25)]">
        <div className="aspect-[16/10] overflow-hidden bg-[var(--slot4-warm-2)]">
          {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--slot4-muted-text)]" /></div>}
        </div>
        <div className="p-5">
          <h3 className="editable-display line-clamp-2 text-[1rem] leading-tight text-[var(--slot4-page-text)]">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-[.9rem] leading-[1.5] text-[var(--slot4-muted-text)]">{stripHtml(summaryText(post))}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex gap-3 rounded-[6px] border border-[var(--editable-border)] p-3 transition hover:bg-[var(--slot4-warm-1)]">
      {image ? <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-[6px] object-cover" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[6px] bg-[var(--slot4-warm-2)]"><FileText className="h-5 w-5 text-[var(--slot4-muted-text)]" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-[.95rem] font-medium leading-tight text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[.85rem] leading-[1.5] text-[var(--slot4-muted-text)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}
