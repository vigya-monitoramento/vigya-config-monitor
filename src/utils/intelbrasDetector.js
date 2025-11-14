/**
 * Serviço para detectar painel Intelbras na rede
 */

import {
  getLocalIP,
  generateIPRange,
  scanIPRange,
  fetchIPContent,
} from './networkUtils'

/**
 * Verifica se um HTML contém a palavra "Intelbras"
 * @param {string} html - HTML da página
 * @returns {boolean} - true se contém "Intelbras"
 */
export function isIntelbrasPanel(html) {
  if (!html) return false
  return html.toLowerCase().includes('intelbras')
}

/**
 * Verifica um IP específico para ver se é um painel Intelbras
 * @param {string} ip - IP a verificar
 * @returns {Promise<boolean>} - true se é painel Intelbras
 */
export async function checkIPForIntelbras(ip) {
  try {
    const html = await fetchIPContent(ip, 5000)
    return isIntelbrasPanel(html)
  } catch (error) {
    console.error(`Erro ao verificar IP ${ip}:`, error)
    return false
  }
}

/**
 * Busca painel Intelbras na rede do usuário
 * @param {function} onProgress - Callback para atualizar progresso
 * @returns {Promise<string|null>} - IP do painel ou null se não encontrado
 */
export async function findIntelbrasPanel(onProgress = null) {
  try {
    // Passo 1: Obter IP local
    if (onProgress) {
      onProgress({
        stage: 'detecting',
        message: 'Detectando IP local...',
      })
    }
    
    const localIP = await getLocalIP()
    console.log('IP local detectado:', localIP)
    
    // Passo 2: Gerar range de IPs
    if (onProgress) {
      onProgress({
        stage: 'preparing',
        message: 'Preparando varredura da rede...',
      })
    }
    
    const ipRange = generateIPRange(localIP)
    console.log(`Varredura de ${ipRange.length} IPs`)
    
    // Passo 3: Varrer IPs abertos
    if (onProgress) {
      onProgress({
        stage: 'scanning',
        message: 'Varrendo IPs abertos...',
        progress: 0,
      })
    }
    
    const reachableIPs = await scanIPRange(ipRange, 15, (scanProgress) => {
      if (onProgress) {
        onProgress({
          stage: 'scanning',
          message: `Varrendo IPs abertos... (${scanProgress.reachable} encontrado${scanProgress.reachable !== 1 ? 's' : ''})`,
          progress: Math.round((scanProgress.current / scanProgress.total) * 100),
          reachableCount: scanProgress.reachable,
        })
      }
    })
    
    console.log(`${reachableIPs.length} IPs reachable encontrados:`, reachableIPs)
    
    if (reachableIPs.length === 0) {
      if (onProgress) {
        onProgress({
          stage: 'error',
          message: 'Nenhum IP respondeu na rede.',
        })
      }
      return null
    }
    
    // Passo 4: Verificar cada IP em busca do painel Intelbras
    if (onProgress) {
      onProgress({
        stage: 'checking',
        message: 'Verificando IPs para encontrar painel Intelbras...',
      })
    }
    
    for (let i = 0; i < reachableIPs.length; i++) {
      const ip = reachableIPs[i]
      
      if (onProgress) {
        onProgress({
          stage: 'checking',
          message: `Verificando ${ip}... (${i + 1}/${reachableIPs.length})`,
          progress: Math.round(((i + 1) / reachableIPs.length) * 100),
        })
      }
      
      const isIntelbras = await checkIPForIntelbras(ip)
      
      if (isIntelbras) {
        console.log(`Painel Intelbras encontrado em: ${ip}`)
        
        if (onProgress) {
          onProgress({
            stage: 'found',
            message: `Painel Intelbras encontrado em ${ip}!`,
            intelbrasIP: ip,
          })
        }
        
        return ip
      }
    }
    
    // Nenhum painel encontrado
    if (onProgress) {
      onProgress({
        stage: 'error',
        message: 'Nenhum painel Intelbras foi encontrado na rede.',
      })
    }
    
    return null
  } catch (error) {
    console.error('Erro ao buscar painel Intelbras:', error)
    
    if (onProgress) {
      onProgress({
        stage: 'error',
        message: `Erro: ${error.message}`,
      })
    }
    
    return null
  }
}
