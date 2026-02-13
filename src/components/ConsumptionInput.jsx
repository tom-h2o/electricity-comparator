import React from 'react'

const HOUSEHOLD_PRESETS = [
    { label: '1 Person', value: 1500, icon: '👤' },
    { label: '2 People', value: 2500, icon: '👥' },
    { label: '3 People', value: 3500, icon: '👨‍👩‍👧' },
    { label: '4 People', value: 4250, icon: '👨‍👩‍👧‍👦' },
    { label: '5+ People', value: 5000, icon: '🚌' },
]

export default function ConsumptionInput({ value, onChange }) {
    return (
        <div className="flex-col">
            <div className="input-group">
                <label className="input-label">Annual Consumption (kWh)</label>
                <div className="flex-row">
                    <input
                        type="number"
                        className="input-control"
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        min="0"
                        step="50"
                    />
                    <input
                        type="range"
                        min="500"
                        max="10000"
                        step="50"
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        style={{ flex: 1 }}
                    />
                </div>
            </div>

            <div>
                <label className="input-label">Quick Estimator</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.5rem' }}>
                    {HOUSEHOLD_PRESETS.map((preset) => (
                        <button
                            key={preset.label}
                            className={`btn btn-secondary ${value === preset.value ? 'btn-primary' : ''}`}
                            onClick={() => onChange(preset.value)}
                            style={value === preset.value ? { backgroundColor: 'var(--primary)', color: 'white', borderColor: 'var(--primary)' } : {}}
                        >
                            <div className="flex-col" style={{ gap: '0.25rem', fontSize: '0.875rem' }}>
                                <span style={{ fontSize: '1.25rem' }}>{preset.icon}</span>
                                <span>{preset.value}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
