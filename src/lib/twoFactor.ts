import { authenticator } from 'otplib';

export function generate2FASecret(label: string) {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(label, 'MyVillage', secret);
  return { secret, otpauth };
}

export function verify2FACode(secret: string, token: string) {
  return authenticator.check(token, secret);
}
