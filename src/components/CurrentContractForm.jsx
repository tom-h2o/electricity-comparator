import React, { useState, useEffect } from 'react'

export default function CurrentContractForm({ onSave, initialData }) {
    const [form, setForm] = useState({
        baseFee: '',
        pricePerKwh: ''
    })

    useEffect(() => {
        if (initialData) {
            setForm({
                baseFee: initialData.baseFee,
                pricePerKwh: initialData.pricePerKwh
            })
        }
    }, [initialData])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.baseFee || !form.pricePerKwh) return

        onSave({
            baseFee: Number(form.baseFee),
            pricePerKwh: Number(form.pricePerKwh)
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="card" style={{ border: '2px dashed var(--primary)', backgroundColor: '#f0f9ff' }}>
            <h2 style={{ color: 'var(--primary)' }}>Current Contract (Baseline)</h2>
            <p className="mb-4" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Enter your current rates to see how much you can save.
            </p>

            <form onSubmit={handleSubmit} className="flex-col">
                <div className="flex-row" style={{ flexWrap: 'wrap' }}>
                    <div className="input-group" style={{ flex: 1, minWidth: '120px' }}>
                        <label className="input-label">Base Fee (€/Month)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="baseFee"
                            value={form.baseFee}
                            onChange={handleChange}
                            className="input-control"
                            placeholder="e.g. 15.00"
                            required
                        />
                    </div>

                    <div className="input-group" style={{ flex: 1, minWidth: '120px' }}>
                        <label className="input-label">Price (Cent/kWh)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="pricePerKwh"
                            value={form.pricePerKwh}
                            onChange={handleChange}
                            className="input-control"
                            placeholder="e.g. 40.00"
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    {initialData ? 'Update Baseline' : 'Set as Baseline'}
                </button>
            </form>
        </div>
    )
}
