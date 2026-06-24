export function md5(str: string): string {
  const rotateLeft = (x: number, n: number) => (x << n) | (x >>> (32 - n))
  const toUtf8 = (s: string) => {
    const utf8: number[] = []
    for (let i = 0; i < s.length; i++) {
      let c = s.charCodeAt(i)
      if (c < 0x80) { utf8.push(c); continue }
      if (c < 0x800) { utf8.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f)); continue }
      if (c < 0xd800 || c >= 0xe000) { utf8.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f)); continue }
      i++; c = 0x10000 + (((c & 0x3ff) << 10) | (s.charCodeAt(i) & 0x3ff))
      utf8.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 0x3f), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f))
    }
    return utf8
  }
  const bytes = toUtf8(str)
  const origLen = bytes.length * 8
  bytes.push(0x80)
  while (bytes.length % 64 !== 56) bytes.push(0)
  for (let i = 0; i < 8; i++) bytes.push((origLen >>> (i * 8)) & 0xff)

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476
  const T = new Array(64)
  for (let i = 0; i < 64; i++) T[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000)

  for (let offset = 0; offset < bytes.length; offset += 64) {
    const M = new Array(16)
    for (let i = 0; i < 16; i++) M[i] = bytes[offset + i * 4] | (bytes[offset + i * 4 + 1] << 8) | (bytes[offset + i * 4 + 2] << 16) | (bytes[offset + i * 4 + 3] << 24)
    let A = a0, B = b0, C = c0, D = d0
    for (let i = 0; i < 64; i++) {
      let F, g
      if (i < 16) { F = (B & C) | (~B & D); g = i }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16 }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16 }
      else { F = C ^ (B | ~D); g = (7 * i) % 16 }
      F = (F + A + T[i] + M[g]) & 0xffffffff
      A = D; D = C; C = B; B = (B + rotateLeft(F, [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][Math.floor(i / 4)])) & 0xffffffff
    }
    a0 = (a0 + A) & 0xffffffff; b0 = (b0 + B) & 0xffffffff; c0 = (c0 + C) & 0xffffffff; d0 = (d0 + D) & 0xffffffff
  }

  const toHex = (n: number) => {
    const hex = (n >>> 0).toString(16)
    return '00000000'.slice(hex.length) + hex
  }
  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0)
}

export async function md5File(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return md5(binary)
}
