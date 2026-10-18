import { useRef, useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import useFocusTrap from './useFocusTrap'

function TrapDemo() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const firstRef = useRef(null)
  useFocusTrap(open, containerRef, () => setOpen(false), firstRef)

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      <div
        ref={containerRef}
        role="dialog"
        aria-label="Example"
        hidden={!open}
        {...(!open ? { inert: '' } : {})}
      >
        <button type="button" ref={firstRef}>
          First
        </button>
        <button type="button">Last</button>
      </div>
    </div>
  )
}

describe('useFocusTrap', () => {
  it('moves focus into the dialog and returns it when closed', async () => {
    const user = userEvent.setup()
    render(<TrapDemo />)

    const opener = screen.getByRole('button', { name: 'Open dialog' })
    await user.click(opener)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()
    })

    await user.click(screen.getByRole('button', { name: 'Last' }))
    await user.tab()
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(opener).toHaveFocus()
    })
    expect(document.querySelector('[role="dialog"]')).toHaveAttribute('inert')
  })
})
