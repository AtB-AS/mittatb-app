import {sha256} from 'js-sha256';
import {Buffer} from 'buffer';

// RFC 7636 allows a verifier of 43-128 chars. 32 random bytes base64url-encoded
// yields a 43-char verifier with 256 bits of entropy.
const VERIFIER_BYTE_LENGTH = 32;

export type PkcePair = {
  verifier: string;
  challenge: string;
};

/**
 * Generate a PKCE (RFC 7636) verifier/challenge pair using the S256 method.
 *
 * The `verifier` stays on-device and is only sent to our backend when
 * completing the flow; the `challenge` is placed on the authorization URL. This
 * binds the authorization code to this app session, so an intercepted code
 * cannot be redeemed without the verifier.
 */
export function generatePkcePair(): PkcePair {
  const randomBytes = new Uint8Array(VERIFIER_BYTE_LENGTH);
  crypto.getRandomValues(randomBytes);
  const verifier = base64UrlEncode(randomBytes);
  const challenge = base64UrlEncode(
    new Uint8Array(sha256.arrayBuffer(verifier)),
  );
  return {verifier, challenge};
}

function base64UrlEncode(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
