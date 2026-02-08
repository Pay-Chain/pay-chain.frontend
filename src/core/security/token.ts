
import { EncryptJWT, jwtDecrypt } from 'jose';

const SECRET_KEY = process.env.ENCRYPT_KEY || 'default-secret-key-must-be-32-chars';

// Ensure key is exactly 32 bytes for A256GCM
const ensure32Bytes = (str: string): Uint8Array => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  if (encoded.length === 32) return encoded;
  if (encoded.length > 32) return encoded.slice(0, 32);
  const padded = new Uint8Array(32);
  padded.set(encoded);
  return padded;
};

const key = ensure32Bytes(SECRET_KEY);

export async function encryptToken(payload: string): Promise<string> {
  return new EncryptJWT({ token: payload })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .encrypt(key);
}

export async function decryptToken(jwe: string): Promise<string | null> {
  try {
    const { payload } = await jwtDecrypt(jwe, key);
    return payload.token as string;
  } catch (error) {
    return null;
  }
}
