import {devices} from '@playwright/test'

export default {
  testDir: 'tests/playwright',
  globalTimeout: 60000,
  timeout: 2000,
  fullyParallel: false,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // maxFailures: 1,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:1520',
    ignoreHTTPSErrors: true,
    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
    // Capture screenshot after each test failure.
    screenshot: 'only-on-failure',
    // headless: false,
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
  ],
  // Run local dev server before starting the tests.
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://0.0.0.0:5173',
  //   reuseExistingServer: !process.env.CI,
  // },
}
