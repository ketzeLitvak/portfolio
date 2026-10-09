export const passwordIterations = 600_000;
const encoder = new TextEncoder();

export function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function randomBytes(size: number): Uint8Array<ArrayBuffer> {
  return crypto.getRandomValues(new Uint8Array(size));
}

export async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(text));
  return bytesToHex(new Uint8Array(digest));
}

export function differingBits(a: string, b: string): number {
  let count = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i += 2) {
    let value = parseInt(a.slice(i, i + 2), 16) ^ parseInt(b.slice(i, i + 2), 16);
    while (value) {
      count += value & 1;
      value >>= 1;
    }
  }
  return count;
}

export async function passwordDigest(password: string, salt: Uint8Array): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new Uint8Array(salt), iterations: passwordIterations },
    key,
    256,
  );
  return bytesToHex(new Uint8Array(bits));
}

export interface PasswordComparison {
  salts: [string, string];
  hashes: [string, string];
  salted: boolean;
}

export async function comparePasswords(
  password: string,
  salted: boolean,
): Promise<PasswordComparison> {
  const salts: [Uint8Array, Uint8Array] = salted
    ? [randomBytes(16), randomBytes(16)]
    : [new Uint8Array(), new Uint8Array()];
  const hashes = await Promise.all(salts.map((salt) => passwordDigest(password, salt)));
  return {
    salted,
    salts: [bytesToHex(salts[0]), bytesToHex(salts[1])],
    hashes: [hashes[0], hashes[1]],
  };
}

export interface CipherEnvelope {
  key: CryptoKey;
  otherKey: CryptoKey;
  iv: Uint8Array<ArrayBuffer>;
  ciphertext: ArrayBuffer;
}

export async function encryptMessage(message: string): Promise<CipherEnvelope> {
  const [key, otherKey] = await Promise.all([
    crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']),
    crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['decrypt']),
  ]);
  const iv = randomBytes(12);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    encoder.encode(message),
  );
  return { key, otherKey, iv, ciphertext };
}

export function ciphertextBytes(
  envelope: CipherEnvelope,
  tampered: boolean,
): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(envelope.ciphertext.slice(0));
  if (tampered) bytes[0] ^= 1;
  return bytes;
}

export async function decryptMessage(
  envelope: CipherEnvelope,
  otherKey: boolean,
  tampered: boolean,
): Promise<string | null> {
  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: envelope.iv, tagLength: 128 },
      otherKey ? envelope.otherKey : envelope.key,
      ciphertextBytes(envelope, tampered),
    );
    return new TextDecoder().decode(plaintext);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'OperationError') return null;
    throw error;
  }
}

export interface SigningIdentity {
  keys: CryptoKeyPair;
  fingerprint: string;
}
export interface SignedMessage {
  identity: SigningIdentity;
  otherIdentity: SigningIdentity;
  signature: ArrayBuffer;
  message: string;
}

export async function createSigningIdentity(): Promise<SigningIdentity> {
  const keys = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, [
    'sign',
    'verify',
  ]);
  const publicBytes = await crypto.subtle.exportKey('spki', keys.publicKey);
  const fingerprint = bytesToHex(
    new Uint8Array(await crypto.subtle.digest('SHA-256', publicBytes)),
  );
  return { keys, fingerprint };
}

export async function signMessage(message: string): Promise<SignedMessage> {
  const [identity, otherIdentity] = await Promise.all([
    createSigningIdentity(),
    createSigningIdentity(),
  ]);
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    identity.keys.privateKey,
    encoder.encode(message),
  );
  return { identity, otherIdentity, signature, message };
}

export async function verifyMessage(
  packet: SignedMessage,
  message: string,
  otherIdentity: boolean,
): Promise<boolean> {
  const key = otherIdentity ? packet.otherIdentity.keys.publicKey : packet.identity.keys.publicKey;
  return crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    packet.signature,
    encoder.encode(message),
  );
}
