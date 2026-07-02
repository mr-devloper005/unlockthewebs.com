'use client'

import Link from 'next/link'
import { ArrowUpRight, Github, Twitter, Linkedin } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/**
 * Dark warm footer with a CTA/talk strip on top, then multi-column nav.
 * Renamed task labels appear here as a discovery surface — nav stays clean.
 */
export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-start gap-6 px-4 py-[72px] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-[84px] lg:px-8 lg:py-[96px]">
          <div>
            <p className="editable-mono text-[.85rem] uppercase tracking-[0.16em] text-white/60">
              Join the network
            </p>
            <h2 className="editable-display mt-3 max-w-xl text-[1.875rem] leading-[1.15] text-white lg:text-[2.5rem]">
              Publish once. Reach every corner of the network.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={session ? '/create' : '/signup'}
              className="inline-flex items-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-6 py-3 text-[.95rem] font-medium text-[var(--slot4-on-accent)] transition hover:brightness-95"
            >
              {session ? 'Submit a post' : 'Get started'} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] border border-white/30 bg-transparent px-6 py-3 text-[.95rem] font-medium text-white transition hover:bg-white/10">
              Talk to us
            </Link>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-white/15 bg-white/[0.06]">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
            </span>
            <span className="editable-display text-xl text-white">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-5 max-w-sm text-[1rem] leading-[1.6] text-white/70">
            {globalContent.footer?.description || SITE_CONFIG.description}
          </p>
       
        </div>

        <FooterColumn title="Discovery">
          <FooterLink href="/listing">Directory</FooterLink>
          
        </FooterColumn>

        <FooterColumn title="Resources">
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
          <FooterLink href="/search">Search</FooterLink>
        </FooterColumn>

        <FooterColumn title="Account">
          {session ? (
            <>
              <FooterLink href="/create">Submit a post</FooterLink>
              <button
                type="button"
                onClick={logout}
                className="text-left text-[1rem] text-white/70 transition hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <FooterLink href="/login">Sign in</FooterLink>
              <FooterLink href="/signup">Get started</FooterLink>
            </>
          )}
        </FooterColumn>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-start justify-between gap-3 px-4 py-6 text-[.85rem] text-white/50 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
          <p className="editable-mono uppercase tracking-[0.16em]">
            {globalContent.footer?.bottomNote || 'Built for connected discovery.'}
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="editable-mono text-[.85rem] uppercase tracking-[0.16em] text-white/60">{title}</h3>
      <div className="mt-5 grid gap-3">{children}</div>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-[1rem] text-white/70 transition hover:text-white">
      {children}
    </Link>
  )
}
