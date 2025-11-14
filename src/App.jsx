import { useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { WelcomeScreen } from './components/WelcomeScreen'
import { DetectionScreen } from './components/DetectionScreen'
import { SetupScreen } from './components/SetupScreen'
import './App.css'

function AppContent() {
  const { currentScreen, isLoading } = useApp()

  useEffect(() => {
    console.log('App React iniciado com sucesso!')
  }, [])

  // Aguarda o carregamento dos dados do storage
  if (isLoading) {
    return <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'white' }}>
      <div style={{ textAlign: 'center', color: '#999' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>Carregando...</div>
      </div>
    </div>
  }

  return (
    <div className="app-container">
      {currentScreen === 'welcome' && <WelcomeScreen />}
     {currentScreen === 'detection' && <DetectionScreen />}
      {currentScreen === 'setup' && <SetupScreen />}
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
