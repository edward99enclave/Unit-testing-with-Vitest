'use client'
import React from 'react'

export function Button({ onClick, children }: { onClick: () => void, children: React.ReactNode }) {
    return (
        <button
            className="btn-primary"
            aria-label="action"
            onClick={onClick}
            style={{
                backgroundColor: 'rgb(255, 0, 0)',
            }}
        >
            {children}
        </button>
    )
}