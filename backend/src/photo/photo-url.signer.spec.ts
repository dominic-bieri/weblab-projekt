import { PhotoUrlSigner } from './photo-url.signer.js';

const PHOTO_ID = '11111111-1111-1111-1111-111111111111';

describe('PhotoUrlSigner', () => {
  let signer: PhotoUrlSigner;

  beforeEach(() => {
    process.env.PHOTO_URL_SIGNING_SECRET = 'test-secret';
    signer = new PhotoUrlSigner();
  });

  it('verifies a freshly signed URL', () => {
    const { exp, sig } = signer.sign(PHOTO_ID);

    expect(signer.verify(PHOTO_ID, exp, sig)).toBe(true);
  });

  it('rejects a tampered signature', () => {
    const { exp, sig } = signer.sign(PHOTO_ID);

    expect(signer.verify(PHOTO_ID, exp, sig.replace(/.$/, '0'))).toBe(false);
  });

  it('rejects a signature issued for a different photo', () => {
    const { exp, sig } = signer.sign(PHOTO_ID);

    expect(
      signer.verify('22222222-2222-2222-2222-222222222222', exp, sig),
    ).toBe(false);
  });

  it('rejects an expired URL', () => {
    const past = Math.floor(Date.now() / 1000) - 60;
    const { sig } = signer.sign(PHOTO_ID);

    expect(signer.verify(PHOTO_ID, past, sig)).toBe(false);
  });

  it('buckets exp so repeated calls in the same window return the same URL (ADR 4)', () => {
    expect(signer.sign(PHOTO_ID)).toEqual(signer.sign(PHOTO_ID));
  });
});
