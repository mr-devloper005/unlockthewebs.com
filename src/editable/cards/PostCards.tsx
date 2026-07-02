import Link from 'next/link'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/** Editorial feature card — image-led with dark overlay, lemon CTA. */
export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[480px] p-8 sm:p-10 lg:min-h-[560px]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover opacity-70 ${dc.motion.zoom}`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(40,36,32,0.15)_0%,rgba(40,36,32,0.75)_100%)]" />
        <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-end lg:min-h-[500px]">
          <span className="inline-flex w-fit items-center gap-2 rounded-[6px] border border-white/25 bg-black/25 px-3 py-1.5 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-white backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
            {label}
          </span>
          <h3 className="editable-display mt-6 max-w-3xl text-[2rem] leading-[1.15] text-white sm:text-[2.5rem] lg:text-[3rem]">
            {post.title}
          </h3>
          <p className="mt-5 max-w-2xl text-[1.1rem] leading-[1.5] text-white/80">{getEditableExcerpt(post, 200)}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-6 py-3 text-[.95rem] font-medium text-[var(--slot4-on-accent)]">
            Read the story <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/** Rail card — warm surface, wide media, lemon accent dot. */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} ${dc.media.ratioWide}`}>
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} loading="lazy" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-[6px] bg-white/95 px-2.5 py-1 editable-mono text-[.7rem] uppercase tracking-[0.14em] text-[var(--slot4-page-text)]">
          <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
          No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-5">
        <p className={dc.type.eyebrow}>{getEditableCategory(post)}</p>
        <h3 className="editable-display mt-3 line-clamp-3 text-[1.35rem] leading-tight text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className={`mt-3 line-clamp-2 text-[.95rem] leading-[1.55] ${pal.mutedText}`}>{getEditableExcerpt(post, 120)}</p>
      </div>
    </Link>
  )
}

/** Compact numbered card — warm soft panel. */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.soft} p-6 ${dc.motion.lift}`}>
      <div className="flex items-start gap-5">
        <span className="editable-display flex h-12 w-12 shrink-0 items-center justify-center rounded-[6px] bg-[var(--slot4-accent-soft)] text-lg text-[var(--slot4-page-text)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className={`flex items-center gap-2 ${dc.type.eyebrow}`}>
            <Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}
          </p>
          <h3 className="editable-display mt-2 line-clamp-2 text-[1.25rem] leading-tight text-[var(--slot4-page-text)] group-hover:opacity-80">
            {post.title}
          </h3>
          <p className={`mt-2 line-clamp-2 text-[.95rem] leading-[1.55] ${pal.mutedText}`}>{getEditableExcerpt(post, 105)}</p>
        </div>
      </div>
    </Link>
  )
}

/** Wide article list card — image left, copy right. */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-4 ${dc.motion.lift} sm:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className={`${dc.media.frame} aspect-[16/12] sm:aspect-auto sm:min-h-[200px]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} loading="lazy" />
      </div>
      <div className="min-w-0 py-2 sm:py-4 sm:pr-4">
        <p className={dc.type.eyebrow}>Entry {String(index + 1).padStart(2, '0')}</p>
        <h2 className="editable-display mt-3 line-clamp-3 text-[1.5rem] leading-tight text-[var(--slot4-page-text)] sm:text-[1.75rem]">
          {post.title}
        </h2>
        <p className={`mt-4 line-clamp-3 text-[1rem] leading-[1.5] ${pal.mutedText}`}>{getEditableExcerpt(post, 190)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-[.95rem] font-medium text-[var(--slot4-page-text)]">
          Read entry <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
