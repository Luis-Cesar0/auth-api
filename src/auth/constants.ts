export const JWT_EXPIRES_IN = '15m' as const;

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('JWT_SECRET deve ter pelo menos 32 bytes configurados');
  }

  return secret;
}
