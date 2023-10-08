import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'build/local/tests',

  // Run all tests in parallel.
  fullyParallel: true,

  // Configure projects for major browsers.
/*  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ] */
});