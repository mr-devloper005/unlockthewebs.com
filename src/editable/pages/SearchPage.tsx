import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { taskThemes } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'
import { formatRichHtml } from '@/components/shared/rich-content'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function displayTaskLabel(key: TaskKey | null) {
  if (!key) return 'Entry'
  return taskThemes[key]?.kicker || key
}

function SearchResultCard({ post }: { post: SitePost }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const label = displayTaskLabel(task)

  return (
    <Link href={href} className={`group block overflow-hidden rounded-[6px] border border-[var(--editable-border)] bg-white transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(40,36,32,0.25)]`}>
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-warm-2)]">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-[6px] bg-white/95 px-2.5 py-1 editable-mono text-[.7rem] uppercase tracking-[0.14em] text-[var(--slot4-page-text)]">
            <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
            {label}
          </span>
        </div>
      ) : null}
      <div className="p-6">
        {!image ? (
          <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] px-2.5 py-1 editable-mono text-[.7rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
            <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
            {label}
          </span>
        ) : null}
        <h2 className="editable-display mt-4 line-clamp-3 text-[1.25rem] leading-tight text-[var(--slot4-page-text)]">{post.title}</h2>
        {summary ? <div className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]" dangerouslySetInnerHTML={{ __html: formatRichHtml(summary) }} /> : null}
        <span className="mt-4 inline-flex items-center gap-1.5 text-[.9rem] font-medium text-[var(--slot4-page-text)]">Open result <ArrowUpRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main>
        <section className="bg-[var(--slot4-warm-1)]">
          <div className={`${dc.shell.section} ${dc.shell.sectionYMd}`}>
            <span className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border)] bg-white px-3 py-1.5 editable-mono text-[.85rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
              <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
              {pagesContent.search.hero.badge}
            </span>
            <h1 className="editable-display mt-6 max-w-3xl text-[2.625rem] leading-[1.1] tracking-[-0.005em] text-[var(--slot4-page-text)] sm:text-[2.8rem] lg:text-[3.5rem]">
              {pagesContent.search.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-[1.125rem] leading-[1.5] text-[var(--slot4-muted-text)]">
              {pagesContent.search.hero.description}
            </p>

            <form action="/search" className="mt-10 rounded-[6px] border border-[var(--editable-border)] bg-white p-4 sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] px-4 py-3">
                <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-[.95rem] font-medium outline-none placeholder:text-[var(--slot4-muted-text)]" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <label className="flex items-center gap-2 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] px-4 py-3">
                  <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-[.9rem] font-medium outline-none placeholder:text-[var(--slot4-muted-text)]" />
                </label>
                <select name="task" defaultValue={task} className="rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] px-4 py-3 text-[.9rem] font-medium text-[var(--slot4-page-text)] outline-none">
                  <option value="">All sections</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{taskThemes[item.key]?.kicker || item.label}</option>)}
                </select>
                <button className={dc.button.primary} type="submit">Search <ArrowUpRight className="h-4 w-4" /></button>
              </div>
            </form>
          </div>
        </section>

        <section className="bg-[var(--slot4-page-bg)]">
          <div className={`${dc.shell.section} ${dc.shell.sectionYMd}`}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="editable-mono text-[.75rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">{results.length} results</p>
                <h2 className="editable-display mt-2 text-[1.875rem] leading-tight text-[var(--slot4-page-text)] lg:text-[2.5rem]">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
              </div>
              <Link href="/" className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border-strong)] px-5 py-2.5 text-[.95rem] font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-warm-2)]">
                Browse latest <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {results.length ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {results.map((post) => <SearchResultCard key={post.id || post.slug} post={post} />)}
              </div>
            ) : (
              <div className="mt-8 rounded-[6px] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-warm-1)] p-10 text-center">
                <p className="editable-display text-[1.5rem] leading-tight text-[var(--slot4-page-text)]">No matching entries found.</p>
                <p className="mt-3 text-[.95rem] leading-[1.55] text-[var(--slot4-muted-text)]">Try a different keyword, section, or category.</p>
              </div>
            )}

            <div className="mt-14">
              <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
