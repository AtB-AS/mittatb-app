/**
 * In-memory state for the e-mail login flows, never put in navigation params
 * since those can end up in navigation logs and state.
 *
 * - Sign-up and reset: the code is verified first, then held here while the
 *   user chooses a password. The final call uses up the code.
 * - Log-in on an unverified e-mail: the password is held here while the user
 *   enters the code.
 *
 * Both are lost if the app is killed; the screens handle that by sending the
 * user back a step. Cleared when the flow completes or restarts.
 */
let pendingPassword: string | undefined = undefined;
let pendingCode: string | undefined = undefined;

export const setPendingEmailPassword = (password: string) => {
  pendingPassword = password;
};

export const getPendingEmailPassword = () => pendingPassword;

export const setPendingEmailCode = (code: string) => {
  pendingCode = code;
};

export const getPendingEmailCode = () => pendingCode;

export const clearEmailLoginSession = () => {
  pendingPassword = undefined;
  pendingCode = undefined;
};

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

/** Counts characters like identity does (code points, not UTF-16 units). */
export const isValidPassword = (password: string) => {
  const length = Array.from(password).length;
  return length >= MIN_PASSWORD_LENGTH && length <= MAX_PASSWORD_LENGTH;
};

export const EMAIL_CODE_LENGTH = 6;

/**
 * Keeps only digits, so pasting "123 456" or "123-456" works, then limits the
 * length.
 */
export const sanitizeEmailCode = (text: string) =>
  text.replace(/\D/g, '').slice(0, EMAIL_CODE_LENGTH);

/** Formats seconds as m:ss, e.g. 42 → "0:42". */
export const formatCountdown = (seconds: number) => {
  const safe = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${minutes}:${rest.toString().padStart(2, '0')}`;
};
