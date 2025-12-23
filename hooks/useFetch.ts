
import { useState, useEffect } from 'react'

export function useFetch(url: string) {
  const [data, setData] = useState<unknown>(null)

  useEffect(() => {
    // 1. Native Fetch Call
    fetch(url)
      .then(r => r.json())
      .then(setData)
  }, [url])

  // 2. Return State
  return { data }
}