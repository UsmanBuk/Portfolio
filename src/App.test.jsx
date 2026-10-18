import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import About from './components/About'
import Contact from './components/Contact'
import Courses from './components/Courses'
import Navbar from './components/Navbar'
import Portfolio from './components/Portfolio'
import Resume from './components/Resume'
import Schedule from './components/Schedule'
import { NAV_ITEMS } from './constants'
import LegacyPages from './legacy/LegacyPages'

function Pages() {
  const [activePage, setActivePage] = useState('about')

  return (
    <>
      <Navbar activePage={activePage} onNavigate={setActivePage} />
      <About isActive={activePage === 'about'} onNavigate={setActivePage} />
      <Resume isActive={activePage === 'resume'} />
      <Portfolio isActive={activePage === 'portfolio'} />
      <LegacyPages activePage={activePage} />
      <Courses isActive={activePage === 'courses'} />
      <Contact isActive={activePage === 'contact'} onNavigate={setActivePage} />
      <Schedule isActive={activePage === 'schedule'} onNavigate={setActivePage} />
    </>
  )
}

function pageEl(id) {
  return document.querySelector(`[data-page="${id}"]`)
}

describe('navigation', () => {
  it.each(NAV_ITEMS)('shows the $label page and hides the others', async ({ id, label }) => {
    const user = userEvent.setup()
    render(<Pages />)

    await user.click(screen.getByRole('button', { name: label }))

    await waitFor(() => {
      expect(pageEl(id)).not.toHaveAttribute('inert')
    })
    expect(pageEl(id)).toHaveClass('active')
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-current', 'page')

    for (const other of NAV_ITEMS.filter((item) => item.id !== id)) {
      expect(pageEl(other.id)).toHaveAttribute('inert')
      expect(pageEl(other.id)).not.toHaveClass('active')
      expect(screen.getByRole('button', { name: other.label })).not.toHaveAttribute('aria-current')
    }
  })
})
