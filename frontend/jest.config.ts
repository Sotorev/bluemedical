import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
	dir: './',
})

const config: Config = {
	coverageProvider: 'v8',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	collectCoverageFrom: [
		'src/**/*.{js,jsx,ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/*.stories.{js,jsx,ts,tsx}',
		'!src/**/__tests__/**',
		'!src/app/layout.tsx',
		'!src/app/globals.css',
	],
	coverageThreshold: {
		global: {
			branches: 60,
			functions: 40,
			lines: 55,
			statements: 55,
		},
	},
}

export default createJestConfig(config)