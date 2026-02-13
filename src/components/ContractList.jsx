import React, { useMemo } from 'react'

export default function ContractList({ contracts, consumption, onDelete, onEdit, currentContract }) {
    const sortedContracts = useMemo(() => {
        let currentTotal = 0
        if (currentContract) {
            currentTotal = (currentContract.baseFee * 12) + ((consumption * currentContract.pricePerKwh) / 100)
        }

        return contracts.map(contract => {
            const baseCost = contract.baseFee * 12
            const usageCost = (consumption * contract.pricePerKwh) / 100
            const totalCost = baseCost + usageCost - contract.bonus
            const effectivePrice = (totalCost / consumption) * 100
            const savings = currentContract ? currentTotal - totalCost : 0

            return {
                ...contract,
                baseCost,
                usageCost,
                totalCost,
                effectivePrice,
                savings
            }
        }).sort((a, b) => a.totalCost - b.totalCost)
    }, [contracts, consumption, currentContract])

    if (contracts.length === 0) {
        return (
            <div className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                No contracts added yet. Add some above to see comparisons!
            </div>
        )
    }

    return (
        <div className="flex-col">
            {sortedContracts.map((contract, index) => {
                const isBest = index === 0
                return (
                    <div
                        key={contract.id}
                        className="card"
                        style={{
                            borderLeft: isBest ? '4px solid var(--secondary)' : '1px solid var(--border)',
                            position: 'relative'
                        }}
                    >
                        {isBest && (
                            <div style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '20px',
                                background: 'var(--secondary)',
                                color: 'white',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '1rem',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                boxShadow: 'var(--shadow-md)'
                            }}>
                                BEST VALUE
                            </div>
                        )}

                        <div className="flex-row justify-between" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <div>
                                <h3 style={{ color: isBest ? 'var(--secondary)' : 'var(--text-main)' }}>
                                    #{index + 1} {contract.name}
                                </h3>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Based on {consumption} kWh/year
                                </div>
                            </div>

                            <div className="text-center">
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    {contract.totalCost.toFixed(2)} €
                                </div>
                                {currentContract && (
                                    <div style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 'bold',
                                        color: contract.savings >= 0 ? 'var(--secondary)' : 'var(--danger)',
                                        marginTop: '0.25rem'
                                    }}>
                                        {contract.savings >= 0
                                            ? `Save ${contract.savings.toFixed(2)} €`
                                            : `Pay ${Math.abs(contract.savings).toFixed(2)} € more`
                                        }
                                    </div>
                                )}
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    {contract.effectivePrice.toFixed(2)} ct/kWh (effective)
                                </div>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '1rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid var(--border)',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                            gap: '1rem',
                            fontSize: '0.875rem'
                        }}>
                            <div>
                                <span style={{ display: 'block', color: 'var(--text-muted)' }}>Base Fee</span>
                                <strong>{(contract.baseFee * 12).toFixed(2)} €</strong> / yr
                            </div>
                            <div>
                                <span style={{ display: 'block', color: 'var(--text-muted)' }}>Usage</span>
                                <strong>{contract.usageCost.toFixed(2)} €</strong>
                            </div>
                            <div>
                                <span style={{ display: 'block', color: 'var(--text-muted)' }}>Bonus</span>
                                <strong style={{ color: contract.bonus > 0 ? 'var(--secondary)' : 'inherit' }}>
                                    -{contract.bonus.toFixed(2)} €
                                </strong>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                <button
                                    onClick={() => onEdit(contract.id)}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderColor: 'var(--border)' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(contract.id)}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--border)' }}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
