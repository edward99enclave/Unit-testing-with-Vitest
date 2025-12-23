'use client'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()
  
  return (
    <nav>
      <div>Current path: {pathname || 'loading...'}</div>
    </nav>
  )
}

