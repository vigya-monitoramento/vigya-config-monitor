/**
 * Utilitários para varredura de rede e detecção de dispositivos
 */

/**
 * Obtém o IP local da máquina
 * Tenta fazer uma requisição para um servidor externo para detectar o IP local
 * @returns {Promise<string>} - IP local da máquina (ex: 192.168.0.100)
 */
export async function getLocalIP() {
  try {
    // Tenta obter informações de rede usando uma abordagem alternativa
    // Em um app Electron, podemos usar o módulo 'os' via preload
    if (window.electronAPI && window.electronAPI.getLocalIP) {
      return await window.electronAPI.getLocalIP()
    }
    
    // Fallback: tenta com WebRTC
    return new Promise((resolve) => {
      const rtc = new RTCPeerConnection({ iceServers: [] })
      const ips = new Set()
      
      rtc.createDataChannel('')
      rtc.createOffer().then(offer => {
        rtc.setLocalDescription(offer)
      })
      
      rtc.onicecandidate = ice => {
        if (!ice || !ice.candidate) return
        const ipMatch = ice.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/)
        if (ipMatch) ips.add(ipMatch[1])
      }
      
      setTimeout(() => {
        rtc.close()
        const ipArray = Array.from(ips)
        resolve(ipArray[0] || '192.168.0.1')
      }, 1000)
    })
  } catch (error) {
    console.error('Erro ao obter IP local:', error)
    return '192.168.0.1'
  }
}

/**
 * Gera um range de IPs baseado no IP local
 * Ex: Se IP local é 192.168.0.100, gera IPs de 192.168.0.1 a 192.168.0.255
 * @param {string} baseIP - IP base (ex: 192.168.0.100)
 * @returns {string[]} - Array de IPs para varrer
 */
export function generateIPRange(baseIP) {
  const parts = baseIP.split('.')
  if (parts.length !== 4) return []
  
  const network = `${parts[0]}.${parts[1]}.${parts[2]}`
  const ips = []
  
  // Gera IPs de 1 a 254 (excluindo 0 e 255)
  for (let i = 1; i < 255; i++) {
    ips.push(`${network}.${i}`)
  }
  
  return ips
}

/**
 * Testa se um IP está ativo (responde a requisição HTTP)
 * @param {string} ip - IP a testar
 * @param {number} timeout - Timeout em ms
 * @returns {Promise<boolean>} - true se IP responde, false caso contrário
 */
export async function isIPReachable(ip, timeout = 3000) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(`http://${ip}:80`, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors',
    })
    
    clearTimeout(timeoutId)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Faz requisição GET para um IP com timeout
 * @param {string} ip - IP a fazer requisição
 * @param {number} timeout - Timeout em ms
 * @returns {Promise<string|null>} - HTML da página ou null se falhar
 */
export async function fetchIPContent(ip, timeout = 5000) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(`http://${ip}:80/`, {
      method: 'GET',
      signal: controller.signal,
      mode: 'no-cors',
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) return null
    
    const text = await response.text()
    return text
  } catch (error) {
    return null
  }
}

/**
 * Varre um range de IPs em paralelo e retorna os que estão abertos
 * @param {string[]} ips - Array de IPs para varrer
 * @param {number} concurrency - Número de requisições paralelas
 * @param {function} onProgress - Callback para atualizar progresso
 * @returns {Promise<string[]>} - Array de IPs reachable
 */
export async function scanIPRange(ips, concurrency = 10, onProgress = null) {
  const reachable = []
  
  for (let i = 0; i < ips.length; i += concurrency) {
    const batch = ips.slice(i, i + concurrency)
    const results = await Promise.all(
      batch.map(ip => isIPReachable(ip, 2000))
    )
    
    results.forEach((isReachable, index) => {
      if (isReachable) {
        reachable.push(batch[index])
      }
    })
    
    if (onProgress) {
      onProgress({
        current: Math.min(i + concurrency, ips.length),
        total: ips.length,
        reachable: reachable.length,
      })
    }
  }
  
  return reachable
}
