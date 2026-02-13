import React, { useState, useEffect } from 'react'

export default function ContractForm({ onAdd, onUpdate, initialData, onCancel }) {
    const [form, setForm] = useState({
        name: '',
        baseFee: '',
        pricePerKwh: '',
        bonus: ''
    })

    // Populate form when editing
    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name,
                baseFee: initialData.baseFee,
                pricePerKwh: initialData.pricePerKwh,
                bonus: initialData.bonus
            })
        } else {
            setForm({ name: '', baseFee: '', pricePerKwh: '', bonus: '' })
        }
    }, [initialData])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.name || !form.baseFee || !form.pricePerKwh) return

        const contractData = {
            id: initialData ? initialData.id : crypto.randomUUID(),
            name: form.name,
            baseFee: Number(form.baseFee),
            pricePerKwh: Number(form.pricePerKwh),
            bonus: Number(form.bonus) || 0
        }

        if (initialData) {
            onUpdate(contractData)
        } else {
            onAdd(contractData)
            setForm({ name: '', baseFee: '', pricePerKwh: '', bonus: '' })
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    return (
        <form onSubmit={handleSubmit} className="flex-col">
            <div className="input-group">
                <label className="input-label">Provider / Tariff Name</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="input-control"
                    placeholder="e.g. Green Energy Basic"
                    required
                />
            </div>

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
                        placeholder="10.00"
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
                        placeholder="30.00"
                        required
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Bonus / One-time Payment (€)</label>
                <input
                    type="number"
                    step="0.01"
                    name="bonus"
                    value={form.bonus}
                    onChange={handleChange}
                    className="input-control"
                    placeholder="0 (Optional)"
                />
            </div>

            <div className="flex-row">
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    {initialData ? 'Update Contract' : 'Add Contract to Comparison'}
                </button>
                {initialData && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    )
}
