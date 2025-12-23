import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../vitest.setup'
import { useFetch } from '../useFetch'

describe('useFetch', () => {
  beforeEach(() => {
    // Reset MSW handlers for each test
    server.resetHandlers()
  })

  it('loads data', async () => {
    // Use MSW to mock the API response
    server.use(
      http.get('/api', () => {
        return HttpResponse.json({ ok: true })
      })
    )
    
    // 2. Render Hook Isolated
    const { result } = renderHook(() => useFetch('/api'))
    
    // 3. Wait for Async Update
    await waitFor(() => 
      expect(result.current.data).toEqual({ ok: true })
    )
  })
})