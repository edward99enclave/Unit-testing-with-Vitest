'use client'
import { useState } from 'react'

export function UserProfile() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user')
      const data = await response.json()
      setUser(data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={fetchUser} disabled={loading}>
        {loading ? 'Loading...' : 'Load User'}
      </button>
      {user && (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  )
}

