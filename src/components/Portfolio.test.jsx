import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Portfolio from './Portfolio'

describe('Portfolio', () => {
  it('shows only projects that match the selected category', async () => {
    const user = userEvent.setup()
    render(<Portfolio isActive />)

    expect(screen.getByRole('heading', { name: 'PyDebug - Debugging Academy' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Chalkys' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /web development/i }))

    expect(screen.getByRole('heading', { name: 'Chalkys' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'PyDebug - Debugging Academy' })).not.toBeInTheDocument()
  })

  it('shows a project title, category, and tech on the card', () => {
    render(<Portfolio isActive />)

    const card = screen.getByRole('link', { name: /chalkys \(opens in a new tab\)/i })
    expect(card).toHaveTextContent('Chalkys')
    expect(card).toHaveTextContent('Web Development')
    expect(card).toHaveTextContent('Shopify')
  })
})
