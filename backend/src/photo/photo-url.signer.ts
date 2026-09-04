import { createHmac, timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';

const SIGNED_URL_TTL_SECONDS = 5 * 60;

@Injectable()
export class PhotoUrlSigner {
  private readonly secret = 'daily-lens-secret'; // TODO durch env ersetzen

  sign(photoId: string): { exp: number; sig: string } {
    const exp = Math.floor(Date.now() / 1000) + SIGNED_URL_TTL_SECONDS;
    return { exp, sig: this.computeSignature(photoId, exp) };
  }

  verify(photoId: string, exp: number, sig: string): boolean {
    if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    const expected = Buffer.from(this.computeSignature(photoId, exp));
    const actual = Buffer.from(sig);
    return (
      expected.length === actual.length && timingSafeEqual(expected, actual)
    );
  }

  private computeSignature(photoId: string, exp: number): string {
    return createHmac('sha256', this.secret)
      .update(`${photoId}.${exp}`)
      .digest('hex');
  }
}
