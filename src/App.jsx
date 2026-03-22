import React, { useState, useEffect, useRef } from 'react'
import ConsumptionInput from './components/ConsumptionInput'
import ContractForm from './components/ContractForm'
import ContractList from './components/ContractList'
import CurrentContractForm from './components/CurrentContractForm'
import CostChart from './components/CostChart'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const [consumption, setConsumption] = useState(3500)
  const [contracts, setContracts] = useState([])
  const [currentContract, setCurrentContract] = useState(null)
  const [editingContract, setEditingContract] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system')
  const isInitialMount = useRef(true)

  // Fetch data on mount
  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then(data => {
        if (data && typeof data.consumption === 'number') {
          setConsumption(data.consumption);
          setContracts(data.contracts || []);
          setCurrentContract(data.currentContract || null);
        }
        isInitialMount.current = false;
      })
      .catch(err => {
        console.error('Failed to load data', err);
        // We still allow the app to function with default values,
        // but it might not save properly if the API is entirely down.
        isInitialMount.current = false;
      })
  }, [])

  // Auto-save data
  useEffect(() => {
    if (isInitialMount.current) return

    const timer = setTimeout(() => {
      fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consumption,
          contracts,
          currentContract
        }),
      }).catch(err => console.error('Failed to save data', err))
    }, 1000) // Debounce save by 1s

    return () => clearTimeout(timer)
  }, [consumption, contracts, currentContract])

  const addContract = (contract) => {
    setContracts([...contracts, contract])
  }

  const deleteContract = (id) => {
    setContracts(contracts.filter(c => c.id !== id))
    if (editingContract?.id === id) {
      setEditingContract(null)
    }
  }

  const updateContract = (updatedContract) => {
    setContracts(contracts.map(c => c.id === updatedContract.id ? updatedContract : c))
    setEditingContract(null)
  }

  const startEditing = (id) => {
    const contract = contracts.find(c => c.id === id)
    if (contract) {
      setEditingContract(contract)
      // Scroll to form
      const formElement = document.getElementById('contract-form')
      if (formElement) formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Theme Logic
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="container">
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <header className="mb-4 text-center">
        <h1>Electricity Comparator</h1>
        <p style={{ color: 'var(--text-muted)' }}>Find the best contract for your home</p>
      </header>

      <main className="app-grid">
        <section className="card">
          <h2>Consumption Settings</h2>
          <ConsumptionInput value={consumption} onChange={setConsumption} />
        </section>

        <CurrentContractForm onSave={setCurrentContract} initialData={currentContract} />

        <section className="card" id="contract-form">
          <h2>{editingContract ? 'Edit Contract' : 'Add Contract'}</h2>
          <ContractForm
            onAdd={addContract}
            onUpdate={updateContract}
            initialData={editingContract}
            onCancel={() => setEditingContract(null)}
          />
        </section>

        <section>
          <h2>Results ({contracts.length})</h2>
          {contracts.length > 0 && (
            <CostChart
              contracts={contracts}
              consumption={consumption}
              currentContract={currentContract}
            />
          )}
          <ContractList
            contracts={contracts}
            consumption={consumption}
            onDelete={deleteContract}
            onEdit={startEditing}
            currentContract={currentContract}
          />
        </section>
      </main>
    </div>
  )
}

export default App
