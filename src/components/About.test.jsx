import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import About from './About'

describe('certification dialog', () => {
  it('opens with the certification details and closes with the button', async () => {
    const user = userEvent.setup()
    render(<About isActive onNavigate={vi.fn()} />)

    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog.closest('[data-modal-container]')).toHaveAttribute('inert')

    await user.click(screen.getByRole('button', { name: /aws solutions architect/i }))

    expect(dialog.closest('[data-modal-container]')).not.toHaveAttribute('inert')
    expect(dialog).toHaveTextContent(/designing scalable, secure cloud architectures/i)

    await user.click(screen.getByRole('button', { name: 'Close certification details' }))
    expect(dialog.closest('[data-modal-container]')).toHaveAttribute('inert')
  })

  it('closes the certification dialog with Escape', async () => {
    const user = userEvent.setup()
    render(<About isActive onNavigate={vi.fn()} />)

    const dialog = document.querySelector('[role="dialog"]')
    await user.click(screen.getByRole('button', { name: /aws solutions architect/i }))
    expect(dialog.closest('[data-modal-container]')).not.toHaveAttribute('inert')

    await user.keyboard('{Escape}')
    expect(dialog.closest('[data-modal-container]')).toHaveAttribute('inert')
  })
})
