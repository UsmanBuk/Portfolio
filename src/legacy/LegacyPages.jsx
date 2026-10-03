import { useEffect, useRef } from 'react'
import legacyHtml from './pages.html?raw'

export default function LegacyPages({ activePage }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) {
      return
    }

        root.querySelectorAll('[data-page]').forEach((page) => {
          const isActive = page.dataset.page === activePage
          page.classList.toggle('active', isActive)
          if (isActive) {
            page.removeAttribute('inert')
          } else {
            page.setAttribute('inert', '')
          }
        })
  }, [activePage])

  return (
    <div
      ref={rootRef}
      style={{ display: 'contents' }}
      dangerouslySetInnerHTML={{ __html: legacyHtml }}
    />
  )
}
