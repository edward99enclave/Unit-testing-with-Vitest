import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Timer } from '../Timer'

/**
 * PITFALL #2: Flaky Async Tests
 * 
 * Problem: Tests with timers (setTimeout, setInterval) are slow and flaky.
 * They depend on real time, causing timeouts or race conditions.
 * 
 * This test demonstrates:
 * - Slow tests that wait for real time
 * - Race conditions in async operations
 */

describe('Timer Component - Pitfall & Fix', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // ❌ PITFALL: Slow and flaky - waits for real time
  it.skip('PITFALL: Slow test waiting for real timers', async () => {
    render(<Timer />)
    const startButton = screen.getByText('Start')
    
    fireEvent.click(startButton)
    
    // This waits for REAL 3 seconds - very slow!
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // This might fail due to race conditions
    expect(screen.getByTestId('timer')).toHaveTextContent('Time: 3s')
  }, 5000) // Test timeout set to 5 seconds

  // ✅ FIX: Use fake timers to control time
  it('FIX: Fast test using fake timers', () => {
    render(<Timer />)
    const timer = screen.getByTestId('timer')
    const startButton = screen.getByText('Start')
    
    // Initially at 0
    expect(timer).toHaveTextContent('Time: 0s')
    
    // Start the timer
    fireEvent.click(startButton)
    expect(screen.getByText('Stop')).toBeInTheDocument()
    
    // Fast-forward 1 second - wrap in act for React state updates
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(timer).toHaveTextContent('Time: 1s')
    
    // Fast-forward 2 more seconds
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(timer).toHaveTextContent('Time: 3s')
    
    // Fast-forward 10 seconds instantly
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    expect(timer).toHaveTextContent('Time: 13s')
    
    // Stop the timer
    fireEvent.click(screen.getByText('Stop'))
    expect(screen.getByText('Start')).toBeInTheDocument()
    
    // Time should not advance after stopping
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(timer).toHaveTextContent('Time: 13s')
  })

  // ✅ BONUS: Testing timer cleanup
  it('FIX: Verify timer cleanup on unmount', () => {
    const { unmount } = render(<Timer />)
    const startButton = screen.getByText('Start')
    
    fireEvent.click(startButton)
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    
    // Unmount component
    unmount()
    
    // Advance time after unmount - should not cause errors
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    
    // If we got here without errors, cleanup worked!
    expect(true).toBe(true)
  })
})

