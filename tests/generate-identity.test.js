import {test, expect} from '@playwright/test'

let page

test.beforeAll(async ({browser}) => {
  const context = await browser.newContext()
  page = await context.newPage()
  await page.goto('/')
  const generateButton = page.locator('a[href="/auth/nostr"]')
  await generateButton.click()
})

test('check navigation', async () => {
  const pageTitle = page.locator('h1:has-text("Nostr identity generated")')
  await expect(pageTitle).toBeVisible()
  const gotoProfileLink = page.locator('a[href^="/profile/"]')
  await expect(gotoProfileLink).toBeVisible()
  const gotoItentityLink = page.locator('a[href^="/identities/"]')
  await expect(gotoItentityLink).toBeVisible()
})

test('check storage', async () => {
  const storedIdentities = await page.evaluate(() =>
    localStorage.getItem('identities')
  )
  const identities = JSON.parse(storedIdentities)
  expect(identities).toHaveLength(1)
  const [{publicKey}] = identities
  expect(publicKey).toHaveLength(64)
})

test('go to profile', async () => {
  await page.goto('/profile')
  await page.waitForURL()
  const pageTitle = page.locator('h2:has-text("Profile")')
  await expect(pageTitle).toBeVisible()
})
