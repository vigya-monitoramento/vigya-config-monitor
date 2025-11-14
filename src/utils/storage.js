/**
 * Gerencia armazenamento persistente de dados locais
 * Usa a API de IPC do Electron para salvar/carregar dados
 */

const STORAGE_KEY = 'vigya-monitor-data'

/**
 * Salva dados no armazenamento local
 * @param {object} data - Dados a serem salvos
 */
export function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Erro ao salvar dados:', error)
  }
}

/**
 * Carrega dados do armazenamento local
 * @returns {object|null} - Dados salvos ou null se não houver dados
 */
export function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    return null
  }
}

/**
 * Limpa todos os dados do armazenamento local
 */
export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Erro ao limpar dados:', error)
  }
}
