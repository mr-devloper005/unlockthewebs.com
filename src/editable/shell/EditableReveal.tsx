'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** stagger index — each unit adds ~90ms of delay. */
  index?: number
  /** wrapper element */
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'footer'
  className?: string
  /** amount of the element that must be in view (0..1) before revealing */
  threshold?: number
  /** stagger step in ms */
  step?: number
  style?: CSSProperties
}

/**
 * Fade + slide-up reveal on scroll.
 *
 * Hidden state is applied only after mount (via the `armed` class), so
 * JS-off visitors see content immediately. Respects prefers-reduced-motion
 * via a CSS override in editable-global.css.
 */
export function EditableReveal({
  children,
  index = 0,
  as: Tag = 'div',
  className = '',
  threshold = 0.15,
  step = 90,
  style,
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [armed, setArmed] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setArmed(true)
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  const classes = [
    'editable-reveal',
    armed ? 'editable-reveal--armed' : '',
    visible ? 'is-visible' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const composed: CSSProperties = {
    transitionDelay: `${index * step}ms`,
    ...style,
  }

  // Cast Tag once so TS accepts the JSX without a union blow-up.
  const Element = Tag as unknown as React.ElementType
  return (
    <Element ref={ref} className={classes} style={composed}>
      {children}
    </Element>
  )
}
