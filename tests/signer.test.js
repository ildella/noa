import {test, expect} from '@playwright/test'

test.describe.configure({mode: 'serial'})

// eslint-disable-next-line @stylistic/js/max-len
const intent = '%7B%22kind%22%3A1%2C%22created_at%22%3A1734031095%2C%22content%22%3A%22Authenticate%20me%22%2C%22tags%22%3A%5B%5D%7D?compressionType=none&returnType=signature&type=sign_event&callbackUrl=https%3A%2F%2Fchat.frankie-gpt.com%2Fauth%2Fcallback%3Fevent%3D'

test.skip('no identity, go to home page', async ({page}) => {
  await page.goto(`/signer/${intent}`)
  await page.waitForURL()
  await expect(page).toHaveTitle('Nostr Onboarding')
  const welcomeH2 = page.locator('h2:has-text("Welcome")')
  await expect(welcomeH2).toBeVisible()
  const generateButton = page.locator('a[href="/auth/nostr"]')
  await expect(generateButton).toBeVisible()
  await expect(generateButton).toBeEnabled()
})

test('sign', async ({page}) => {
  await page.goto('/')
  await page.locator('a[href="/auth/nostr"]').click()
  // await page.waitForURL()
  const idetityGenerated = page.locator('h1:has-text("Nostr identity generated")')
  await expect(idetityGenerated).toBeVisible()
  const publicKey = await page.locator('#public-key').textContent()
  // console.log(publicKey)
  // console.log(intent)

  await page.goto(`/signer/${intent}`)
  // await page.waitForURL()
  const pageTitle = page.locator('h1:has-text("Signer")')
  await expect(pageTitle).toBeVisible()
  const signedEventParagraph = page.locator('#signed-event')
  await expect(signedEventParagraph).toBeVisible()
  const textContent = await signedEventParagraph.textContent()
  const signedEvent = JSON.parse(textContent)
  expect(signedEvent).toMatchObject({
    kind: 1,
    content: 'Authenticate me',
    tags: [],
    pubkey: publicKey,
  })
  expect(signedEvent).toHaveProperty('id')
  expect(signedEvent).toHaveProperty('sig')
  expect(signedEvent).toHaveProperty('created_at')
})
