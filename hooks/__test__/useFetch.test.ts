import { renderHook, waitFor } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { useFetch } from '../useFetch'

// 1. Mock Global Fetch
global.fetch = vi.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({ ok: true })
  })
) as unknown as typeof global.fetch

describe('useFetch', () => {
  it('loads data', async () => {
    // 2. Render Hook Isolated
    const { result } = renderHook(() => useFetch('/api'))
    
    // 3. Wait for Async Update
    await waitFor(() => 
      expect(result.current.data).toEqual({ ok: true })
    )
  })
})