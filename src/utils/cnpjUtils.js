/**
 * Valida um CNPJ seguindo o algoritmo oficial
 * @param {string} cnpj - CNPJ com ou sem formatação
 * @returns {boolean} - true se CNPJ é válido, false caso contrário
 */
export function isValidCNPJ(cnpj) {
  // Remove caracteres especiais
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '')
  
  // CNPJ deve ter 14 dígitos
  if (cleanCNPJ.length !== 14) {
    return false
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
    return false
  }
  
  // Cálculo do primeiro dígito verificador
  let size = cleanCNPJ.length - 2
  let numbers = cleanCNPJ.substring(0, size)
  let digits = cleanCNPJ.substring(size)
  let sum = 0
  let pos = size - 7
  
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--
    if (pos < 2) {
      pos = 9
    }
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  if (result !== parseInt(digits.charAt(0))) {
    return false
  }
  
  // Cálculo do segundo dígito verificador
  size = cleanCNPJ.length - 1
  numbers = cleanCNPJ.substring(0, size)
  digits = cleanCNPJ.substring(size)
  sum = 0
  pos = size - 7
  
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--
    if (pos < 2) {
      pos = 9
    }
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  if (result !== parseInt(digits.charAt(0))) {
    return false
  }
  
  return true
}

/**
 * Formata um CNPJ para o padrão XX.XXX.XXX/XXXX-XX
 * @param {string} cnpj - CNPJ com ou sem formatação
 * @returns {string} - CNPJ formatado
 */
export function formatCNPJ(cnpj) {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '')
  
  if (cleanCNPJ.length <= 2) {
    return cleanCNPJ
  }
  if (cleanCNPJ.length <= 5) {
    return cleanCNPJ.replace(/(\d{2})(\d+)/, '$1.$2')
  }
  if (cleanCNPJ.length <= 8) {
    return cleanCNPJ.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3')
  }
  if (cleanCNPJ.length <= 12) {
    return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4')
  }
  return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, '$1.$2.$3/$4-$5')
}
