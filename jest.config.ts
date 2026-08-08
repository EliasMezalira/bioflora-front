import type { Config } from 'jest';
import { createCjsPreset } from 'jest-preset-angular/presets';

export default {
  ...createCjsPreset(),
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.test.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text-summary'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
} satisfies Config;