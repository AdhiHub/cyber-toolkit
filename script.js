// Tabs
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'))
    tab.classList.add('active')
    document.getElementById(tab.dataset.tab).classList.add('active')
  })
})

// Password strength
const passInput = document.getElementById('passwordInput')
const strengthFill = document.getElementById('strengthFill')
const strengthText = document.getElementById('strengthText')
const details = document.getElementById('details')
const togglePass = document.getElementById('togglePass')

togglePass.addEventListener('click', () => {
  const type = passInput.type === 'password' ? 'text' : 'password'
  passInput.type = type
  togglePass.textContent = type === 'password' ? '👁️' : '👁️‍🗨️'
})

passInput.addEventListener('input', () => {
  const val = passInput.value
  if (!val) {
    strengthFill.style.width = '0%'
    strengthFill.style.background = ''
    strengthText.textContent = 'Type a password to check'
    details.textContent = ''
    return
  }

  let score = 0
  const checks = []
  if (val.length >= 8) { score += 25; checks.push('✓ 8+ characters') } else { checks.push('✗ 8+ characters') }
  if (/[a-z]/.test(val)) { score += 15; checks.push('✓ lowercase') } else { checks.push('✗ lowercase') }
  if (/[A-Z]/.test(val)) { score += 20; checks.push('✓ UPPERCASE') } else { checks.push('✗ UPPERCASE') }
  if (/\d/.test(val)) { score += 20; checks.push('✓ numbers') } else { checks.push('✗ numbers') }
  if (/[^a-zA-Z0-9]/.test(val)) { score += 20; checks.push('✓ symbols') } else { checks.push('✗ symbols') }

  strengthFill.style.width = score + '%'
  if (score < 30) { strengthFill.style.background = '#ef4444'; strengthText.textContent = 'Weak'; strengthText.style.color = '#ef4444' }
  else if (score < 50) { strengthFill.style.background = '#f59e0b'; strengthText.textContent = 'Fair'; strengthText.style.color = '#f59e0b' }
  else if (score < 70) { strengthFill.style.background = '#eab308'; strengthText.textContent = 'Good'; strengthText.style.color = '#eab308' }
  else if (score < 90) { strengthFill.style.background = '#22c55e'; strengthText.textContent = 'Strong'; strengthText.style.color = '#22c55e' }
  else { strengthFill.style.background = '#06b6d4'; strengthText.textContent = 'Very Strong'; strengthText.style.color = '#06b6d4' }

  details.innerHTML = checks.join('<br>')
})

// Hash generator
const hashInput = document.getElementById('hashInput')
hashInput.addEventListener('input', async () => {
  const val = hashInput.value
  if (!val) { document.getElementById('md5').textContent = '-'; document.getElementById('sha1').textContent = '-'; document.getElementById('sha256').textContent = '-'; return }
  const enc = new TextEncoder()
  const data = enc.encode(val)
  const md5Hash = await crypto.subtle.digest('MD5', data).catch(() => null) || await simpleHash(val)
  const sha1Hash = await crypto.subtle.digest('SHA-1', data)
  const sha256Hash = await crypto.subtle.digest('SHA-256', data)
  document.getElementById('md5').textContent = await hex(md5Hash || data)
  document.getElementById('sha1').textContent = await hex(sha1Hash)
  document.getElementById('sha256').textContent = await hex(sha256Hash)
})

async function hex(buf) {
  const hashArray = buf instanceof ArrayBuffer ? Array.from(new Uint8Array(buf)) : Array.from(buf)
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) { const chr = str.charCodeAt(i); hash = ((hash << 5) - hash) + chr; hash |= 0 }
  const arr = new Uint8Array(16)
  for (let i = 0; i < 16; i++) arr[i] = (hash >> (i * 2)) & 0xff
  return arr
}

// Encrypt/Decrypt
document.getElementById('encryptBtn').addEventListener('click', () => {
  const text = document.getElementById('encryptInput').value
  const shift = parseInt(document.getElementById('shiftInput').value) || 3
  document.getElementById('encryptResult').textContent = caesar(text, shift)
})
document.getElementById('decryptBtn').addEventListener('click', () => {
  const text = document.getElementById('encryptInput').value
  const shift = parseInt(document.getElementById('shiftInput').value) || 3
  document.getElementById('encryptResult').textContent = caesar(text, -shift)
})

function caesar(str, shift) {
  return str.split('').map(ch => {
    if (ch.match(/[a-z]/i)) {
      const code = ch.charCodeAt(0)
      const base = code >= 65 && code <= 90 ? 65 : 97
      return String.fromCharCode(((code - base + shift) % 26 + 26) % 26 + base)
    }
    return ch
  }).join('')
}