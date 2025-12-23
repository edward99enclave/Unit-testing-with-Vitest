import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../vitest.setup'
import { UserProfile } from '../UserProfile'

/**
 * PITFALL #3: Slow Execution
 * 
 * Problem: Tests hitting real APIs are slow, unreliable, and can fail
 * due to network issues, rate limits, or external service downtime.
 * 
 * This test demonstrates:
 * - Slow tests that hit real network endpoints
 * - Unreliable tests dependent on external services
 */

// Mock fetch globally
global.fetch = vi.fn()

describe('UserProfile Component - Pitfall & Fix', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset MSW handlers to default (empty) for tests that use fetch mock
    server.resetHandlers()
  })

  // ❌ PITFALL: Hitting real API - slow and unreliable
  it.skip('PITFALL: Slow test hitting real API', async () => {
    // This would hit a REAL API endpoint - very slow!
    // Also unreliable: network issues, rate limits, service downtime
    render(<UserProfile />)
    
    const loadButton = screen.getByText('Load User')
    fireEvent.click(loadButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Name:/)).toBeInTheDocument()
    }, { timeout: 10000 })
  })

  // ✅ BONUS: Test with MSW (Mock Service Worker) - even better approach
  // MSW intercepts at the network layer, making it more realistic
  // This is closer to real behavior than mocking fetch directly
  
  // Example 1: Basic MSW usage (MSW v2 syntax)
  it('FIX: Using MSW for network interception', async () => {
    const mockUser = { name: 'Jane Doe', email: 'jane@example.com' }
    
    // Set up MSW handler to intercept the API call
    server.use(
      http.get('/api/user', () => {
        return HttpResponse.json(mockUser)
      })
    )
    
    render(<UserProfile />)
    
    const loadButton = screen.getByText('Load User')
    fireEvent.click(loadButton)
    
    // Verify loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(loadButton).toBeDisabled()
    
    // Wait for data to load (MSW handles the network request)
    await waitFor(() => {
      expect(screen.getByText(`Name: ${mockUser.name}`)).toBeInTheDocument()
      expect(screen.getByText(`Email: ${mockUser.email}`)).toBeInTheDocument()
    })
    
    // Verify button is enabled again after loading
    expect(screen.getByText('Load User')).not.toBeDisabled()
  })
})

