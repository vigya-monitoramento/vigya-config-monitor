import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { findIntelbrasPanel } from '../utils/intelbrasDetector'
import logo from '../assets/logo.jpeg'
import './DetectionScreen.css'

export function DetectionScreen() {
  const { cnpj, intelbrasIP, setIntelbrasIP, setCurrentScreen } = useApp()
  const [status, setStatus] = useState('waiting') // waiting, detecting, found, error
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState(0)
  const [detectedIP, setDetectedIP] = useState('')

  useEffect(() => {
    // Inicia detecção automaticamente
    startDetection()
  }, [])

  const startDetection = async () => {
    setStatus('detecting')
    setProgress(0)
    setMessage('Iniciando varredura de rede...')

    const foundIP = await findIntelbrasPanel((progressUpdate) => {
      setMessage(progressUpdate.message)
      
      if (progressUpdate.progress) {
        setProgress(progressUpdate.progress)
      }
      
      if (progressUpdate.stage === 'found' && progressUpdate.intelbrasIP) {
        setDetectedIP(progressUpdate.intelbrasIP)
        setStatus('found')
      } else if (progressUpdate.stage === 'error') {
        setStatus('error')
      }
    })

    if (foundIP) {
      setDetectedIP(foundIP)
      setIntelbrasIP(foundIP)
      setStatus('found')
      setMessage(`Painel Intelbras encontrado em ${foundIP}!`)
      
      // Aguarda 2 segundos antes de prosseguir
      setTimeout(() => {
        setCurrentScreen('setup')
      }, 2000)
    } else {
      setStatus('error')
      setMessage('Não foi possível localizar um painel Intelbras na sua rede.')
    }
  }

  return (
    <div className="detection-screen">
      <div className="detection-container">
        <img src={logo} alt="Logo Vigya" className="detection-logo" />
        
        <h1 className="detection-title">Detectando painel Intelbras</h1>
        
        <p className="detection-cnpj">CNPJ: <span>{cnpj}</span></p>

        <div className="detection-status-container">
          {status === 'detecting' && (
            <>
              <div className="detection-spinner"></div>
              <p className="detection-message">{message}</p>
              <div className="detection-progress-bar">
                <div 
                  className="detection-progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="detection-progress-text">{progress}%</p>
            </>
          )}

          {status === 'found' && (
            <div className="detection-success">
              <div className="detection-checkmark">✓</div>
              <p className="detection-success-message">{message}</p>
              <p className="detection-ip-found">IP: {detectedIP}</p>
              <p className="detection-redirecting">Prosseguindo para configuração...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="detection-error">
              <div className="detection-error-icon">✕</div>
              <p className="detection-error-message">{message}</p>
              <button 
                onClick={startDetection}
                className="detection-retry-button"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
