import React from 'react'

export default function ThemeToggle({ theme, toggleTheme }) {
    return (
        <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{
                position: 'fixed',
                top: '1rem',
                right: '1rem',
                padding: '0.5rem',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                backgroundColor: 'var(--bg-card)',
                boxShadow: 'var(--shadow-md)'
            }}
            aria-label="Toggle Dark Mode"
        >
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    )
}
