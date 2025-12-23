import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Create MSW server instance
export const server = setupServer()

// Establish API mocking before all tests
beforeAll(() => {
  // Use 'bypass' to allow tests with their own fetch mocks to work
  // Tests that use MSW should explicitly set up handlers with server.use()
  server.listen({ onUnhandledRequest: 'bypass' })
})

// Reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => {
  server.resetHandlers()
})

// Clean up after the tests are finished
afterAll(() => {
  server.close()
})