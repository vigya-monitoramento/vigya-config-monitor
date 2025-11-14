import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState('Conectado ao Vigya Monitor')

  useEffect(() => {
    // Seu código de inicialização aqui
    console.log('App React iniciado com sucesso!')
  }, [])

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Vigya Control Monitor</h1>
      </header>
      
      <main className="app-content">
        <div className="status-box">
          <h2>Status</h2>
          <p>{status}</p>
        </div>

        <section className="info-section">
          <h2>Bem-vindo ao Vigya Monitor</h2>
          <p>Seu aplicativo agora está rodando com React! 🚀</p>
          
          <ul className="features">
            <li>✅ Electron com React</li>
            <li>✅ Hot reload em desenvolvimento</li>
            <li>✅ Auto-update automático</li>
            <li>✅ Build para Windows e Linux</li>
          </ul>
        </section>

        <section className="tailscale-section">
          <h3>TailScale Status</h3>
          <p>Integração com TailScale ativa</p>
        </section>
      </main>

      <footer className="app-footer">
        <p>Vigya Control Monitor v1.0.4</p>
      </footer>
    </div>
  )
}

export default App
