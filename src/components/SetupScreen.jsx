import { useApp } from '../context/AppContext'
import logo from '../assets/logo.jpeg'
import './SetupScreen.css'
import pkg from '../../package.json'

const APP_VERSION = pkg.version

export function SetupScreen() {
  const { cnpj, logout } = useApp()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="setup-screen">
      <div className="setup-container">
        <img src={logo} alt="Logo Vigya" className="setup-logo" />
        
        <h1 className="setup-title">Bem-vindo a Vigya Monitoramento</h1>
        
        <p className="setup-cnpj">CNPJ: <span>{cnpj}</span></p>
        
        <div className="setup-loading-container">
          <div className="spinner"></div>
        </div>
        
        <p className="setup-message">
          Estamos trabalhando para configurar seu monitoramento, agora é só aguardar e tomar um café ☕
        </p>

        <button className="setup-logout-button" onClick={handleLogout}>
          Sair
        </button>
      </div>

      <footer className="setup-footer">
        <p>Vigya Control Monitor v{APP_VERSION}</p>
      </footer>
    </div>
  )
}
