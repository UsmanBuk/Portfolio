import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Chatbot from './Chatbot'

function chatDialog() {
  return document.getElementById('chatbot-window')
}

async function openChat(user) {
  await user.click(screen.getByRole('button', { name: 'Open chat' }))
  expect(chatDialog()).toBeVisible()
}

describe('Chatbot', () => {
  it('opens and closes the chat window', async () => {
    const user = userEvent.setup()
    render(<Chatbot />)

    const dialog = chatDialog()
    expect(dialog).not.toBeVisible()
    expect(dialog).toHaveAttribute('inert')

    await openChat(user)
    expect(dialog).not.toHaveAttribute('inert')

    await user.click(document.getElementById('chatbot-close'))
    expect(dialog).not.toBeVisible()
    expect(dialog).toHaveAttribute('inert')
  })

  it('shows a loading state and then the reply', async () => {
    const user = userEvent.setup()
    let finish
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise((resolve) => {
            finish = resolve
          })
      )
    )
    render(<Chatbot />)
    await openChat(user)

    await user.type(screen.getByLabelText('Message'), 'What does Usman do?')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(screen.getByRole('status')).toHaveTextContent("Looking up Usman's work")
    expect(chatDialog()).toHaveAttribute('aria-busy', 'true')

    finish({
      ok: true,
      json: async () => ({ reply: 'Usman is an AI engineer.' })
    })

    await waitFor(() => {
      expect(screen.getByText('Usman is an AI engineer.')).toBeInTheDocument()
    })
    expect(screen.queryByText("Looking up Usman's work")).not.toBeInTheDocument()
  })

  it('shows a useful message when the server returns an error', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => ({
          detail: 'I could not generate a reply just now. Please try again in a moment.'
        })
      })
    )
    render(<Chatbot />)
    await openChat(user)
    await user.type(screen.getByLabelText('Message'), 'hi')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent('I could not generate a reply just now. Please try again in a moment.')
  })

  it('shows a useful message when the server returns 429', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({ detail: 'Too many questions. Please wait 12 seconds and try again.' })
      })
    )
    render(<Chatbot />)
    await openChat(user)
    await user.type(screen.getByLabelText('Message'), 'hi')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Too many questions. Please wait 12 seconds and try again.'
    )
  })

  it('shows a useful message when the request cannot reach the server', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    render(<Chatbot />)
    await openChat(user)
    await user.type(screen.getByLabelText('Message'), 'hi')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      "I can't reach the chatbot server right now. Please try again, or use the contact form."
    )
  })

  it('blocks input longer than 500 characters', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    render(<Chatbot />)
    await openChat(user)

    const input = screen.getByLabelText('Message')
    expect(input).toHaveAttribute('maxlength', '500')

    await user.click(input)
    await user.paste('x'.repeat(501))
    expect(input).toHaveValue('x'.repeat(500))
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
