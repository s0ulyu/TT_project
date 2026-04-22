import { useState } from "react"
import ExpenseForm from "@/components/expense/ExpenseForm"
import ExpenseList from "@/components/expense/ExpenseList"

function App() {
  const [reloadKey, setReloadKey] = useState(0)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
        <ExpenseList
          reloadKey={reloadKey}
          onCreated={() => setReloadKey((v) => v + 1)}
        />
        <ExpenseForm onCreated={() => setReloadKey((v) => v + 1)} />
      </div>
    </main>
  )
}

export default App