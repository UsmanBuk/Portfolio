import { expect, test } from '@playwright/test'
import { TABS, listenForAppErrors, waitForApp } from './helpers.js'

test('every tab loads with no console errors', async ({ page }) => {
  const errors = listenForAppErrors(page)
  await page.goto('/')
  await waitForApp(page)

  for (const tab of TABS) {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('button', { name: tab.label }).click()
    await expect(page.locator(`[data-page="${tab.id}"]`)).toHaveClass(/active/)
  }

  expect(errors, errors.join('\n')).toEqual([])
})

test('schedule page renders without using the Cal.com embed', async ({ page }) => {
  await page.goto('/schedule.html')
  await waitForApp(page)
  await expect(page.getByRole('heading', { name: /let's discuss your ai challenge/i })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Calendar booking widget' })).toBeVisible()
})

test('case study page loads with styles applied', async ({ page }) => {
  await page.goto('/case-studies/nhs-south-yorkshire-rag.html')
  const title = page.getByRole('heading', { name: 'NHS South Yorkshire ICB' })
  await expect(title).toBeVisible()

  const fontFamily = await title.evaluate((node) => getComputedStyle(node).fontFamily)
  expect(fontFamily.toLowerCase()).toContain('poppins')
})

test('CV PDF links return 200', async ({ request }) => {
  for (const path of ['/assets/documents/UsmanCV.pdf', '/assets/documents/DetailedCV.pdf']) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    expect(response.headers()['content-type']).toMatch(/pdf/i)
  }
})

test('chatbot shows a mocked reply', async ({ page }) => {
  await page.route('**/api/chat', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ reply: 'Usman is an AI engineer.' })
    })
  })

  await page.goto('/')
  await waitForApp(page)
  await page.getByRole('button', { name: 'Open chat' }).click()
  await page.locator('#chatbot-input').fill('What does Usman do?')
  await page.locator('#chatbot-send').click()
  await expect(page.getByText('Usman is an AI engineer.')).toBeVisible()
})
