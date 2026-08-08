import type { Config } from 'jest';
import { createCjsPreset } from 'jest-preset-angular/presets';

export default {
  ...createCjsPreset(),
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.test.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text-summary'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/main.ts',
    '<rootDir>/src/app/app.config.ts',
    '<rootDir>/src/app/app.routes.ts',
    '<rootDir>/src/environments/*',
  ],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
} satisfies Config;