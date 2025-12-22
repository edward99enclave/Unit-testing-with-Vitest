import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../Button'

describe('Button testing with multiple tests', () => {
    it('calls onClick when clicked', () => {
        // 1. Setup Mock & Render
        const onClick = vi.fn()
        render(<Button onClick={onClick}>Save</Button>)
        
        // 2. Simulate User Interaction
        const btn = screen.getByRole('button', { name: /action/i })
        fireEvent.click(btn)

        // 3. Assert Behavior
        expect(onClick).toHaveBeenCalled()
        expect(btn).toHaveTextContent('Save')
    })

    it('check background color', () => {
        // 1. Setup Mock & Render
        render(<Button onClick={() => {}}>Save</Button>)

        // 2. Assert Behavior
        const btn = screen.getByRole('button', { name: /action/i })
        expect(btn).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' })
    })
})