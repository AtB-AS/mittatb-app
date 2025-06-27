import {z} from 'zod';
import {Buffer} from 'buffer';

/**
 * Reference:
 * - https://www.rfc-editor.org/rfc/rfc7519#section-4.1
 * - https://openid.net/specs/openid-connect-core-1_0.html#IDToken
 * - https://firebase.google.com/docs/rules/rules-and-auth#identify_users
 */
const IdToken = z.object({
  /** Abt customer account id (Custom claim) */
  abt_id: z.string().optional(),
  /** Customer number (Custom claim) */
  customer_number: z.number().optional(),

  /** Issuer (RFC 7519) */
  iss: z.string().optional(),
  /** Audience (RFC 7519) */
  aud: z.string().optional(),
  /** Subject (RFC 7519) */
  sub: z.string().optional(),
  /** Issued at (RFC 7519) */
  iat: z.number().optional().transform(unixTimeToDate),
  /** Expiration time (RFC 7519) */
  exp: z.number().optional().transform(unixTimeToDate),
  /** Not before (RFC 7519) */
  nbf: z.number().optional().transform(unixTimeToDate),

  /** Time when authentication occurred (OpenID Connect) */
  auth_time: z.number().optional().transform(unixTimeToDate),

  /** Firebase UID */
  user_id: z.string().optional(),
  firebase: z
    .object({
      /**
       * The sign-in provider used to obtain this token. Typically "anonymous"
       * or "custom".
       */
      sign_in_provider: z.string().optional(),
      /**
       * Dictionary of all the identities that are associated with this user's
       * account.
       */
      identities: z
        .object({
          phone: z.array(z.string()).optional(),
          email: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
});
type IdToken = z.infer<typeof IdToken>;

export function decodeIdToken(idTokenString: string): IdToken | undefined {
  const decoded = decodeJwtPayload(idTokenString);
  return IdToken.safeParse(decoded).data;
}

export function isIdTokenValid(
  idToken: IdToken | undefined,
  serverNow: Date,
): boolean {
  if (!idToken) return false;

  if (idToken.exp && idToken.exp < serverNow) return false;
  if (idToken.nbf && idToken.nbf > serverNow) return false;

  return true;
}

/** https://jwt.io/introduction */
function decodeJwtPayload(token: string): any {
  try {
    const buffer = Buffer.from(token.split('.')[1], 'base64');
    return JSON.parse(buffer.toString());
  } catch {
    return undefined;
  }
}

/** Converts UNIX timestamp in seconds to Date */
function unixTimeToDate(unixTime: number | undefined) {
  if (!unixTime) return undefined;
  return new Date(unixTime * 1000);
}
