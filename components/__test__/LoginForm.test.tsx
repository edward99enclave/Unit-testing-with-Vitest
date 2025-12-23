import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LoginForm } from '../LoginForm'

/**
 * PITFALL #4: Vanity Metrics
 * 
 * Problem: 100% code coverage doesn't mean your app works!
 * Testing trivial things (like checking if a button exists) gives
 * false confidence while missing critical user flows.
 * 
 * This test demonstrates:
 * - Trivial tests that achieve high coverage but miss real issues
 * - Focus on critical user paths instead
 */

describe('LoginForm Component - Pitfall & Fix', () => {
  const mockOnLogin = vi.fn()

  beforeEach(() => {
    mockOnLogin.mockClear()
  })

  // ❌ PITFALL: Vanity metrics - testing trivial things
  describe('PITFALL: Vanity Metrics (what NOT to do)', () => {
    it.skip('PITFALL: Testing that button exists (trivial)', () => {
      render(<LoginForm onLogin={mockOnLogin} />)
      // This gives you coverage but doesn't test real functionality!
      expect(screen.getByText('Login')).toBeInTheDocument()
    })

    it.skip('PITFALL: Testing that inputs exist (trivial)', () => {
      render(<LoginForm onLogin={mockOnLogin} />)
      // Again, coverage but not meaningful
      expect(screen.getByLabelText('Email:')).toBeInTheDocument()
      expect(screen.getByLabelText('Password:')).toBeInTheDocument()
    })

    it.skip('PITFALL: Testing individual state changes (fragmented)', () => {
      render(<LoginForm onLogin={mockOnLogin} />)
      const emailInput = screen.getByTestId('email-input')
      
      // Testing implementation details, not user behavior
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      expect(emailInput).toHaveValue('test@example.com')
      
      // This doesn't test if the form actually works!
    })
  })

  // ✅ FIX: Focus on critical user paths
  describe('FIX: Critical Paths (what TO do)', () => {
    it('FIX: Test complete login flow - happy path', () => {
      render(<LoginForm onLogin={mockOnLogin} />)
      
      // Simulate real user interaction
      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const submitButton = screen.getByText('Login')
      
      // User types email
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
      
      // User types password
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      
      // User submits form
      fireEvent.click(submitButton)
      
      // Verify the critical behavior: onLogin was called with correct data
      expect(mockOnLogin).toHaveBeenCalledTimes(1)
      expect(mockOnLogin).toHaveBeenCalledWith('user@example.com', 'password123')
    })

    it('FIX: Test validation - empty fields', () => {
      render(<LoginForm onLogin={mockOnLogin} />)
      
      const submitButton = screen.getByText('Login')
      
      // User tries to submit without filling fields
      fireEvent.click(submitButton)
      
      // Critical: Form should show error and NOT call onLogin
      expect(screen.getByTestId('error')).toHaveTextContent(
        'Email and password are required'
      )
      expect(mockOnLogin).not.toHaveBeenCalled()
    })

    it('FIX: Test validation - invalid email format', () => {
      render(<LoginForm onLogin={mockOnLogin} />)
      
      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const form = screen.getByText('Login').closest('form')!
      
      // User enters invalid email (no @ symbol)
      fireEvent.change(emailInput, { target: { value: 'notanemail' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      
      // Submit form directly to bypass HTML5 validation
      fireEvent.submit(form)
      
      // Critical: Form should validate and show error
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid email format')
      expect(mockOnLogin).not.toHaveBeenCalled()
    })

    it('FIX: Test complete user journey - form submission flow', () => {
      render(<LoginForm onLogin={mockOnLogin} />)
      
      // Complete user journey: fill form → submit → verify callback
      fireEvent.change(screen.getByTestId('email-input'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByTestId('password-input'), {
        target: { value: 'securepass' },
      })
      fireEvent.submit(screen.getByText('Login').closest('form')!)
      
      // This tests the ENTIRE flow, not just individual pieces
      expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'securepass')
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    })
  })

  // ✅ BONUS: Test edge cases in user flows
  it('FIX: Test error message clears on retry', () => {
    render(<LoginForm onLogin={mockOnLogin} />)
    
    // First attempt: invalid
    fireEvent.click(screen.getByText('Login'))
    expect(screen.getByTestId('error')).toBeInTheDocument()
    
    // User fixes and retries
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'valid@example.com' },
    })
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password' },
    })
    fireEvent.click(screen.getByText('Login'))
    
    // Error should be cleared on successful submission
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(mockOnLogin).toHaveBeenCalled()
  })
})

