import {sha256} from 'js-sha256';
import {Buffer} from 'buffer';
import {generatePkcePair} from './pkce';

const isBase64Url = (s: string) => /^[A-Za-z0-9\-_]+$/.test(s);

const base64UrlOfSha256 = (verifier: string) =>
  Buffer.from(sha256.arrayBuffer(verifier))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

describe('generatePkcePair', () => {
  it('produces a 43-char base64url verifier within the RFC 7636 range', () => {
    const {verifier} = generatePkcePair();
    expect(verifier).toHaveLength(43);
    expect(verifier.length).toBeGreaterThanOrEqual(43);
    expect(verifier.length).toBeLessThanOrEqual(128);
    expect(isBase64Url(verifier)).toBe(true);
  });

  it('produces a base64url challenge with no padding', () => {
    const {challenge} = generatePkcePair();
    expect(isBase64Url(challenge)).toBe(true);
    expect(challenge).not.toContain('=');
  });

  it('challenge is the S256 hash of the verifier', () => {
    const {verifier, challenge} = generatePkcePair();
    expect(challenge).toEqual(base64UrlOfSha256(verifier));
  });

  it('generates a fresh verifier on each call', () => {
    expect(generatePkcePair().verifier).not.toEqual(
      generatePkcePair().verifier,
    );
  });
});
