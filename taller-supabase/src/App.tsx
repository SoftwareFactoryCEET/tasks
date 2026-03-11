import './App.css'
import { Home } from './pages/Home'

function App() {
  return (
    <>
      <header className="app-header">
        <h1>SENA — Gestión de Tareas</h1>
      </header>
      <main className="app-main">
        <Home />
      </main>
    </>
  )
}

export default App