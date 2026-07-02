'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/**
 * Navbar — dark warm shell (#282420), centered static links, right-side
 * search icon + auth actions. NO task-archive links per brief.
 */
export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const staticLinks = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)]">
      <nav className="mx-auto flex min-h-[76px] w-full max-w-[var(--editable-container)] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-white/15 bg-white/[0.06] transition group-hover:bg-white/[0.10]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="editable-display text-lg text-white">{SITE_CONFIG.name}</span>
        </Link>

        <div className="mx-auto hidden items-center gap-1 lg:flex">
          {staticLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[6px] px-4 py-2 text-[.95rem] font-medium transition ${
                isActive(item.href)
                  ? 'bg-white/[0.10] text-white'
                  : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-[6px] border border-white/15 bg-transparent text-white/70 transition hover:border-white/40 hover:text-white sm:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-5 py-2.5 text-[.9rem] font-medium text-[var(--slot4-on-accent)] transition hover:brightness-95 sm:inline-flex"
              >
                Submit <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-[6px] border border-white/15 px-4 py-2.5 text-[.9rem] font-medium text-white/80 transition hover:border-white/40 hover:text-white sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-[6px] px-4 py-2.5 text-[.9rem] font-medium text-white/80 transition hover:text-white sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-5 py-2.5 text-[.9rem] font-medium text-[var(--slot4-on-accent)] transition hover:brightness-95 sm:inline-flex"
              >
                Get started <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-white/15 bg-transparent text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-[var(--editable-nav-bg)] px-4 py-5 sm:px-6 lg:hidden">
          <Link href="/search" onClick={() => setOpen(false)} className="mb-4 flex items-center gap-3 rounded-[6px] border border-white/15 bg-transparent px-4 py-3 text-sm text-white/80">
            <Search className="h-4 w-4" /> Search {SITE_CONFIG.name}
          </Link>
          <div className="grid gap-1">
            {[{ label: 'Home', href: '/' }, ...staticLinks, ...(session ? [{ label: 'Submit', href: '/create' }] : [{ label: 'Sign in', href: '/login' }, { label: 'Get started', href: '/signup' }])].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-[6px] px-4 py-3 text-sm font-medium transition ${
                  isActive(item.href) ? 'bg-white/[0.10] text-white' : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-[6px] px-4 py-3 text-left text-sm font-medium text-white/70 hover:bg-white/[0.06] hover:text-white">
                Logout
              </button>
            ) : null}
          </div>
          <p className="mt-5 editable-mono text-[.75rem] uppercase tracking-[0.14em] text-white/50">
            {globalContent.nav?.tagline || SITE_CONFIG.tagline}
          </p>
        </div>
      ) : null}
    </header>
  )
}
