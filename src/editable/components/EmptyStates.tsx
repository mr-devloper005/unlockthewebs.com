import Link from 'next/link'
import { ArrowUpRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh entries will appear here automatically once this section is live.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] p-8 text-center', className)}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[6px] bg-[var(--slot4-accent-soft)]">
        <SearchX className="h-5 w-5 text-[var(--slot4-page-text)]" />
      </div>
      <h2 className="editable-display mt-5 text-[1.5rem] leading-tight text-[var(--slot4-page-text)]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-[.95rem] leading-[1.55] text-[var(--slot4-muted-text)]">{description}</p>
      <Link href={actionHref} className="mt-6 inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border-strong)] px-5 py-3 text-[.95rem] font-medium text-[var(--slot4-page-text)] transition hover:bg-white">
        {actionLabel}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'entries', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} will appear here automatically. The page stays ready even when the feed is empty.`}
      actionLabel="Explore the network"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
