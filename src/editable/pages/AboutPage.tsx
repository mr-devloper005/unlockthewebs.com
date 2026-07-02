import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className="bg-[var(--slot4-warm-1)]">
          <div className={`${dc.shell.section} ${dc.shell.sectionYMd}`}>
            <EditableReveal>
              <span className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border)] bg-white px-3 py-1.5 editable-mono text-[.85rem] uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
                <span className="inline-block h-1.5 w-1.5 bg-[var(--slot4-accent)]" />
                {pagesContent.about.badge}
              </span>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-6 max-w-3xl text-[2.625rem] leading-[1.1] tracking-[-0.005em] text-[var(--slot4-page-text)] sm:text-[2.8rem] lg:text-[3.5rem]">
                About {SITE_CONFIG.name}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-6 max-w-2xl text-[1.125rem] leading-[1.5] text-[var(--slot4-muted-text)]">
                {pagesContent.about.description}
              </p>
            </EditableReveal>
          </div>
        </section>

        <section className="bg-[var(--slot4-page-bg)]">
          <div className={`${dc.shell.section} ${dc.shell.sectionYMd} grid gap-12 lg:grid-cols-[1.1fr_0.9fr]`}>
            <article className="space-y-6">
              {pagesContent.about.paragraphs.map((paragraph, i) => (
                <EditableReveal key={paragraph} index={i}>
                  <p className="text-[1.125rem] leading-[1.5] text-[var(--slot4-page-text)]">{paragraph}</p>
                </EditableReveal>
              ))}
            </article>
            <aside className="space-y-5">
              {pagesContent.about.values.map((value, i) => (
                <EditableReveal key={value.title} index={i}>
                  <div className="rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm-1)] p-6">
                    <h2 className="editable-display text-[1.25rem] leading-tight text-[var(--slot4-page-text)]">{value.title}</h2>
                    <p className="mt-3 text-[.95rem] leading-[1.55] text-[var(--slot4-muted-text)]">{value.description}</p>
                  </div>
                </EditableReveal>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
