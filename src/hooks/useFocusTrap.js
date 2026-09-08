import { useEffect } from 'react'

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function useFocusTrap(active, containerRef, onClose, initialFocusRef) {
  useEffect(() => {
    if (!active || !containerRef.current) {
      return undefined
    }

    const container = containerRef.current
    const previouslyFocused = document.activeElement
    const focusFirst = () => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus()
        return
      }

      const nodes = container.querySelectorAll(FOCUSABLE)
      if (nodes.length) {
        nodes[0].focus()
      } else {
        container.setAttribute('tabindex', '-1')
        container.focus()
      }
    }

    const frame = window.requestAnimationFrame(focusFirst)

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const nodes = [...container.querySelectorAll(FOCUSABLE)]
      if (!nodes.length) {
        event.preventDefault()
        return
      }

      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus()
      }
    }
  }, [active, containerRef, onClose, initialFocusRef])
}
