import { defineConfig } from '@playwright/test';

const chrome = process.env.CI ? {} : { channel: 'chrome' as const };

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  projects: [
    {
      name: 'site',
      testMatch: /e2e\.spec\.ts/,
      use: {
        baseURL: 'http://127.0.0.1:4321',
        trace: 'off',
        ...chrome,
      },
    },
    {
      name: 'guide',
      testMatch: /guide\.spec\.ts/,
      use: {
        baseURL: 'http://127.0.0.1:4322',
        trace: 'off',
        ...chrome,
      },
    },
  ],
  webServer: [
    {
      command: 'npx astro preview --host 127.0.0.1 --port 4321',
      url: 'http://127.0.0.1:4321/',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'node tests/preview-guide.mjs',
      url: 'http://127.0.0.1:4322/',
      reuseExistingServer: false,
      timeout: 300000,
    },
  ],
});
