import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Contact from './Contact'

describe('Contact form', () => {
  it('marks name, email, and message as required', () => {
    render(<Contact isActive onNavigate={vi.fn()} />)

    expect(screen.getByLabelText('Full name')).toBeRequired()
    expect(screen.getByLabelText('Email address')).toBeRequired()
    expect(screen.getByLabelText('Your message')).toBeRequired()
  })

  it('shows a success message when EmailJS sends the form', async () => {
    const user = userEvent.setup()
    window.emailjs = {
      sendForm: vi.fn().mockResolvedValue({})
    }
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<Contact isActive onNavigate={vi.fn()} />)

    await user.type(screen.getByLabelText('Full name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email address'), 'ada@example.com')
    await user.type(screen.getByLabelText('Your message'), 'Hello')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(window.emailjs.sendForm).toHaveBeenCalled()
    expect(await screen.findByRole('status')).toHaveTextContent('Message sent successfully!')
  })

  it('shows an error message when EmailJS fails', async () => {
    const user = userEvent.setup()
    window.emailjs = {
      sendForm: vi.fn().mockRejectedValue(new Error('network'))
    }
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<Contact isActive onNavigate={vi.fn()} />)

    await user.type(screen.getByLabelText('Full name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email address'), 'ada@example.com')
    await user.type(screen.getByLabelText('Your message'), 'Hello')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Failed to send message. Please try again.'
    )
  })

  it('does not send when EmailJS is missing', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<Contact isActive onNavigate={vi.fn()} />)

    await user.type(screen.getByLabelText('Full name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email address'), 'ada@example.com')
    await user.type(screen.getByLabelText('Your message'), 'Hello')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Failed to send message. Please try again.'
      )
    })
  })
})
