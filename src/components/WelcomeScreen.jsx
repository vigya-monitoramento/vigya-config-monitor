import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { isValidCNPJ, formatCNPJ } from '../utils/cnpjUtils'
import logo from '../assets/logo.jpeg'
import './WelcomeScreen.css'

export function WelcomeScreen() {
  const { setCnpj, setCurrentScreen } = useApp()
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const value = e.target.value
    const formatted = formatCNPJ(value)
    setInputValue(formatted)
    
    // Limpa o erro quando o usuário começa a digitar
    if (error) {
      setError('')
    }
  }

  const handleStart = () => {
    const cleanCNPJ = inputValue.replace(/[^\d]/g, '')
    
    if (!cleanCNPJ.trim()) {
      setError('Por favor, digite um CNPJ')
      return
    }
    
    if (!isValidCNPJ(inputValue)) {
      setError('CNPJ inválido. Verifique os números e tente novamente.')
      return
    }
    
    setCnpj(inputValue)
    setCurrentScreen('setup')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleStart()
    }
  }

  return (
    <div className="welcome-screen">
      <div className="welcome-container">
        <img src={logo} alt="Logo Vigya" className="welcome-logo" />
        
        <h1 className="welcome-title">Bem-vindo a Vigya Monitoramento</h1>
        
        <div className="welcome-input-container">
          <label htmlFor="cnpj-input" className="welcome-label">Insira seu CNPJ</label>
          <input
            id="cnpj-input"
            type="text"
            placeholder=""
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`welcome-input ${error ? 'input-error' : ''}`}
            maxLength="18"
          />
          {error && <p className="welcome-error">{error}</p>}
        </div>

        <button 
          onClick={handleStart}
          className="welcome-button"
        >
          Iniciar
        </button>
      </div>
    </div>
  )
}
