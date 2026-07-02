import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-warm-1)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border)] bg-white px-3 py-1.5 editable-mono text-[.85rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
              <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
              {pagesContent.auth.login.badge}
            </span>
            <h1 className="editable-display mt-6 max-w-xl text-[2.625rem] leading-[1.1] tracking-[-0.005em] text-[var(--slot4-page-text)] sm:text-[2.8rem] lg:text-[3.5rem]">
              {pagesContent.auth.login.title}
            </h1>
            <p className="mt-6 max-w-lg text-[1.125rem] leading-[1.5] text-[var(--slot4-muted-text)]">{pagesContent.auth.login.description}</p>
          </div>
          <div className="rounded-[6px] border border-[var(--editable-border)] bg-white p-7 sm:p-9">
            <h2 className="editable-display text-[1.5rem] leading-tight text-[var(--slot4-page-text)]">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-6 text-[.95rem] text-[var(--slot4-muted-text)]">
              New here? <Link href="/signup" className="font-medium text-[var(--slot4-page-text)] underline underline-offset-4 hover:opacity-70">{pagesContent.auth.login.createCta}</Link>
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
