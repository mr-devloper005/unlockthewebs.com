'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Globe2 } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Directory onboarding', body: 'Add your entry, verify contact details, and get reviewed before publish.' },
      { icon: Phone, title: 'Partnership support', body: 'Talk through bulk publishing, local growth, and operational setup.' },
      { icon: MapPin, title: 'Coverage requests', body: 'Need a new geography or category lane? We can shape the Directory around it.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, columns, and long-form ideas that fit the network.' },
      { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.' },
      { icon: Sparkles, title: 'Contributor support', body: 'Get help with voice, formatting, and publication workflow.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features, and visual campaigns.' },
      { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights, commercial requests, and partnerships.' },
      { icon: Mail, title: 'Media kits', body: 'Request decks, editorial support, or feature placement.' },
    ]
  }
  return [
    { icon: Globe2, title: 'Signal submissions', body: 'Suggest links, resources, and boards worth a place in the curated feed.' },
    { icon: Mail, title: 'Curation partnerships', body: 'Coordinate collection projects, reference pages, and link programs.' },
    { icon: Sparkles, title: 'Contributor support', body: 'Need help organising a series or a themed collection? We can help.' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell>
      <main>
        <section className="bg-[var(--slot4-warm-1)]">
          <div className={`${dc.shell.section} ${dc.shell.sectionYMd}`}>
            <EditableReveal>
              <span className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border)] bg-white px-3 py-1.5 editable-mono text-[.85rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
                <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
                {pagesContent.contact.eyebrow}
              </span>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-6 max-w-3xl text-[2.625rem] leading-[1.1] tracking-[-0.005em] text-[var(--slot4-page-text)] sm:text-[2.8rem] lg:text-[3.5rem]">
                {pagesContent.contact.title}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-6 max-w-2xl text-[1.125rem] leading-[1.5] text-[var(--slot4-muted-text)]">
                {pagesContent.contact.description}
              </p>
            </EditableReveal>
          </div>
        </section>

        <section className="bg-[var(--slot4-page-bg)]">
          <div className={`${dc.shell.section} ${dc.shell.sectionYMd} grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start`}>
            <div className="space-y-4">
              {lanes.map((lane, i) => (
                <EditableReveal key={lane.title} index={i}>
                  <div className="rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] p-6">
                    <lane.icon className="h-5 w-5 text-[var(--slot4-page-text)]" />
                    <h2 className="editable-display mt-3 text-[1.25rem] leading-tight text-[var(--slot4-page-text)]">{lane.title}</h2>
                    <p className="mt-2 text-[.95rem] leading-[1.55] text-[var(--slot4-muted-text)]">{lane.body}</p>
                  </div>
                </EditableReveal>
              ))}
            </div>
            <div className="rounded-[6px] border border-[var(--editable-border)] bg-white p-7">
              <h2 className="editable-display text-[1.5rem] leading-tight text-[var(--slot4-page-text)]">{pagesContent.contact.formTitle}</h2>
              <EditableContactLeadForm />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
