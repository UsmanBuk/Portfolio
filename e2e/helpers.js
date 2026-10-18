const THIRD_PARTY = /cal\.com|google|gstatic|emailjs|ionicons|unpkg|fonts\.google/i

const TABS = [
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Resume' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'github', label: 'Github' },
  { id: 'courses', label: 'Courses' },
  { id: 'contact', label: 'Contact' },
  { id: 'schedule', label: 'Consult' }
]

function isThirdParty(text) {
  return THIRD_PARTY.test(text)
}

function listenForAppErrors(page) {
  const errors = []

  page.on('pageerror', (error) => {
    if (!isThirdParty(error.message)) {
      errors.push(error.message)
    }
  })

  page.on('console', (message) => {
    if (message.type() !== 'error') {
      return
    }
    const text = message.text()
    if (!isThirdParty(text)) {
      errors.push(text)
    }
  })

  return errors
}

async function waitForApp(page) {
  await page.locator('#loading-screen').waitFor({ state: 'detached', timeout: 8000 })
  await page.getByRole('navigation', { name: 'Primary' }).waitFor()
}

export { TABS, listenForAppErrors, waitForApp }
