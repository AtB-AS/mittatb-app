/**
 * Holds the password during the e-mail login flow, between the password
 * screen and the code screen.
 *
 * Kept in memory only, never in navigation params, since those can end up in
 * navigation logs and state. Cleared when the flow completes or restarts.
 */
let pendingPassword: string | undefined = undefined;

export const setPendingEmailPassword = (password: string) => {
  pendingPassword = password;
};

export const getPendingEmailPassword = () => pendingPassword;

export const clearPendingEmailPassword = () => {
  pendingPassword = undefined;
};

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

/** Counts characters like identity does (code points, not UTF-16 units). */
export const isValidPassword = (password: string) => {
  const length = Array.from(password).length;
  return length >= MIN_PASSWORD_LENGTH && length <= MAX_PASSWORD_LENGTH;
};
