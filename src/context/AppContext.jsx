import { createContext, useState, useContext, useEffect } from 'react'
import { saveToStorage, loadFromStorage, clearStorage } from '../utils/storage'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [cnpj, setCnpjState] = useState('')
  const [intelbrasIP, setIntelbrasIPState] = useState('')
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [isLoading, setIsLoading] = useState(true)

  // Carrega dados ao montar o componente
  useEffect(() => {
    const savedData = loadFromStorage()
    
    if (savedData && savedData.cnpj) {
      setCnpjState(savedData.cnpj)
      if (savedData.intelbrasIP) {
        setIntelbrasIPState(savedData.intelbrasIP)
      }
      setCurrentScreen('setup')
    }
    
    setIsLoading(false)
  }, [])

  // Wrapper para setCnpj que também salva no storage
  const setCnpj = (newCnpj) => {
    setCnpjState(newCnpj)
    
    if (newCnpj) {
      const savedData = loadFromStorage() || {}
      saveToStorage({ ...savedData, cnpj: newCnpj })
    }
  }

  // Wrapper para setIntelbrasIP que também salva no storage
  const setIntelbrasIP = (newIP) => {
    setIntelbrasIPState(newIP)
    
    if (newIP) {
      const savedData = loadFromStorage() || {}
      saveToStorage({ ...savedData, intelbrasIP: newIP })
    }
  }

  // Wrapper para logout que limpa o storage
  const logout = () => {
    setCnpjState('')
    setIntelbrasIPState('')
    setCurrentScreen('welcome')
    clearStorage()
  }

  const value = {
    cnpj,
    setCnpj,
    intelbrasIP,
    setIntelbrasIP,
    currentScreen,
    setCurrentScreen,
    logout,
    isLoading,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
