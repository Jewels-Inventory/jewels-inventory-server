function hexToBytes(hex) {
  if (hex.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const start = i * 2;
    const byteHex = hex.substring(start, start + 2); // <-- fixed
    bytes[i] = parseInt(byteHex, 16);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function base32toBytes(base32) {
  if (typeof base32 !== 'string') {
    throw new TypeError(`Expected Base32 key as string, got ${typeof base32}`);
  }

  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  const clean = base32.toUpperCase().replace(/=+$/, '');

  let bits = '';
  for (const char of clean) {
    const value = base32Chars.indexOf(char);
    if (value === -1) {
      throw new Error(`Invalid Base32 character: "${char}"`);
    }
    bits += value.toString(2).padStart(5, '0');
  }

  // Only take full bytes; ignore leftover bits
  const bytes = bits.match(/.{8}/g) ?? [];
  return new Uint8Array(bytes.map((b) => parseInt(b, 2)));
}

export function getCounterFromTime({ now, timeStep = 30 }) {
  return Math.floor(now / 1000 / timeStep);
}

async function computeHMACSha1(counterHex, keyBase32) {
  const messageBytes = hexToBytes(counterHex);
  const keyBytes = base32toBytes(keyBase32);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    {
      name: 'HMAC',
      hash: { name: 'SHA-1' },
    },
    false,
    ['sign'],
  );

  const sig = await crypto.subtle.sign('HMAC', cryptoKey, messageBytes);
  return bytesToHex(new Uint8Array(sig));
}

async function generateHOTP({ key, counter = 0 }) {
  const counterHex = counter.toString(16).padStart(16, '0');

  const digestHex = await computeHMACSha1(counterHex, key);
  const bytes = hexToBytes(digestHex);

  const offset = bytes[19] & 0x0f;
  const v =
    ((bytes[offset] & 0x7f) << 24) |
    ((bytes[offset + 1] & 0xff) << 16) |
    ((bytes[offset + 2] & 0xff) << 8) |
    (bytes[offset + 3] & 0xff);

  return String(v % 1_000_000).padStart(6, '0');
}

export async function generateTOTP({ key, now = Date.now(), timeStep = 30 }) {
  const counter = getCounterFromTime({ now, timeStep });
  return generateHOTP({ key, counter });
}
