import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ✅ FIX: Mock next/navigation at module level (BEFORE importing component)
const mockPathname = vi.fn(() => '/dashboard')
const mockPush = vi.fn()
const mockReplace = vi.fn()
const mockRefresh = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: mockRefresh,
  }),
}))

// Import component AFTER mocking
import { Navigation } from '../Navigation'

/**
 * PITFALL #1: Hydration / Router Errors
 * 
 * Problem: "NextRouter was not mounted" error when testing components
 * that use Next.js navigation hooks (usePathname, useRouter, etc.)
 * 
 * This test demonstrates the ERROR you'll get without mocking:
 * Error: usePathname must be used within a Next.js Router context
 */

describe('Navigation Component - Pitfall & Fix', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname.mockReturnValue('/dashboard')
  })

  // ❌ PITFALL: This test passes ONLY because we mocked next/navigation above
  // WITHOUT the mock (comment out lines 10-17), this would fail with:
  // "Error: usePathname must be used within a Next.js Router context"
  it('PITFALL: Would fail without mocking next/navigation', () => {
    // This test passes because we have the mock at the top
    // But it demonstrates what WOULD happen without the mock
    
    // Try to render - this works because of the mock
    render(<Navigation />)
    
    // If you comment out the vi.mock() at lines 10-17 and run this test,
    // you'll see the actual pitfall: the component can't render because
    // usePathname requires a Next.js Router context that doesn't exist in tests
    expect(screen.getByText(/Current path:/)).toBeInTheDocument()
    
    // The fix is shown in the next test - we mock next/navigation
    // See Navigation.pitfall.test.tsx for a file that demonstrates the actual error
  })

  // ✅ FIX: Mock next/navigation before rendering
  it('FIX: Mock next/navigation to avoid router errors', () => {
    mockPathname.mockReturnValue('/dashboard')
    
    // Now it renders without errors because we mocked usePathname
    render(<Navigation />)
    expect(screen.getByText('Current path: /dashboard')).toBeInTheDocument()
  })

  // ✅ BONUS: Test with different pathnames
  it('FIX: Test with different pathnames', () => {
    mockPathname.mockReturnValue('/products')
    render(<Navigation />)
    expect(screen.getByText('Current path: /products')).toBeInTheDocument()

    // Re-render with different pathname
    mockPathname.mockReturnValue('/about')
    const { rerender } = render(<Navigation />)
    rerender(<Navigation />)
    expect(screen.getByText('Current path: /about')).toBeInTheDocument()
  })
})

