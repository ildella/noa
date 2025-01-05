// import {readFile, unlink} from 'fs/promises'
import {test, expect} from '@playwright/test'

test.describe.configure({mode: 'serial'})

test('starting page', async ({page}) => {
  await page.goto('/')
  await page.waitForURL()
  // await expect(page).toHaveTitle(/NOA/)
  await expect(page).toHaveTitle('Nostr Onboarding')
  const welcomeH2 = page.locator('h2:has-text("Welcome")')
  await expect(welcomeH2).toBeVisible()
})

test('edit profile', async ({page}) => {
  await page.goto('/')
  const generateButton = page.locator('a[href="/auth/nostr"]')
  await generateButton.click()
  const gotoProfileLink = page.locator('a[href^="/profile/"]')
  await expect(gotoProfileLink).toBeVisible()
  await gotoProfileLink.click()
  const pageTitle = page.locator('h2:has-text("Profile")')
  await expect(pageTitle).toBeVisible()
})

test('download keys', async ({page}) => {
  await page.goto('/')
  const generateButton = page.locator('a[href="/auth/nostr"]')
  await generateButton.click()
  const gotoIdentity = page.locator('a[href^="/identities/"]')
  await expect(gotoIdentity).toBeVisible()
  await gotoIdentity.click()
  const pageTitle = page.locator('h1:has-text("Identity")')
  await expect(pageTitle).toBeVisible()
  const downloadButton = page.locator('#download-keys')
  await expect(downloadButton).toBeVisible()
  // await downloadButton.click()
  // const file = await readFile('/home/ildella/Downloads/nostr-keys.txt')
  // const keys = file.toString()
  // console.log(keys)
  // const unlinked = await unlink('/home/ildella/Downloads/nostr-keys.txt')
  // console.log({unlinked})
})
