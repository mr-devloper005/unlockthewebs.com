import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Get started', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-warm-1)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:px-8">
          <div className="rounded-[6px] border border-[var(--editable-border)] bg-white p-7 sm:p-9">
            <h1 className="editable-display text-[1.5rem] leading-tight text-[var(--slot4-page-text)]">{pagesContent.auth.signup.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className="mt-6 text-[.95rem] text-[var(--slot4-muted-text)]">
              Already have an account? <Link href="/login" className="font-medium text-[var(--slot4-page-text)] underline underline-offset-4 hover:opacity-70">{pagesContent.auth.signup.loginCta}</Link>
            </p>
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border)] bg-white px-3 py-1.5 editable-mono text-[.85rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
              <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
              {pagesContent.auth.signup.badge}
            </span>
            <h2 className="editable-display mt-6 max-w-xl text-[2.625rem] leading-[1.1] tracking-[-0.005em] text-[var(--slot4-page-text)] sm:text-[2.8rem] lg:text-[3.5rem]">
              {pagesContent.auth.signup.title}
            </h2>
            <p className="mt-6 max-w-lg text-[1.125rem] leading-[1.5] text-[var(--slot4-muted-text)]">{pagesContent.auth.signup.description}</p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
