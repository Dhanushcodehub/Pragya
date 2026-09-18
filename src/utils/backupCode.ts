import crypto from 'crypto';

export function hashBackupCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}