import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

/**
 * PITFALL DEMONSTRATION: This file shows what happens WITHOUT mocking
 * 
 * This test file does NOT mock next/navigation, so it will fail
 * with the error: "usePathname must be used within a Next.js Router context"
 * 
 * Compare this to Navigation.test.tsx which shows the FIX with mocking
 */

// ❌ NO MOCK HERE - This is the pitfall!
// If you uncomment the mock below, the test will pass
// vi.mock('next/navigation', () => ({
//   usePathname: () => '/dashboard',
//   useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
// }))

import { Navigation } from '../Navigation'

describe('Navigation Component - PITFALL (No Mock)', () => {
  // ❌ PITFALL: This test demonstrates what happens WITHOUT mocking
  // Run this test and you'll see it fails because usePathname requires a Router context
  it.skip('PITFALL: Fails without mocking next/navigation', () => {
    // Without the mock, rendering will fail
    // The actual error message will appear in the test output
    expect(() => {
      render(<Navigation />)
    }).toThrow()
  })
})

