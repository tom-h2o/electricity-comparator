import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts'

export default function CostChart({ contracts, consumption, currentContract }) {
    // Prepare data for the chart
    const data = [
        // Add current contract if it exists
        ...(currentContract ? [{
            name: 'Current',
            baseCost: currentContract.baseFee * 12,
            usageCost: (consumption * currentContract.pricePerKwh) / 100,
            bonus: 0, // Current contract usually doesn't have a new bonus
            total: (currentContract.baseFee * 12) + ((consumption * currentContract.pricePerKwh) / 100)
        }] : []),
        // Add other contracts
        ...contracts.map(contract => ({
            name: contract.name,
            baseCost: contract.baseFee * 12,
            usageCost: (consumption * contract.pricePerKwh) / 100,
            bonus: -contract.bonus, // Negative to show deduction
            total: (contract.baseFee * 12) + ((consumption * contract.pricePerKwh) / 100) - contract.bonus
        }))
    ].sort((a, b) => a.total - b.total)

    if (data.length === 0) return null

    return (
        <div className="card" style={{ height: '400px', marginBottom: '2rem' }}>
            <h2>Annual Cost Comparison (€)</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) => `${Math.abs(value).toFixed(2)} €`}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Legend />
                    <Bar dataKey="baseCost" name="Base Cost" stackId="a" fill="var(--primary)" />
                    <Bar dataKey="usageCost" name="Usage Cost" stackId="a" fill="var(--secondary)" />
                    <Bar dataKey="bonus" name="Bonus" stackId="a" fill="var(--accent)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
