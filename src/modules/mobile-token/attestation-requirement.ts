const AttestationRequirementHeaderName = 'atb-attestation-requirement';

/**
 * Entur can ask for the token to be re-attested soon, on a successful renew,
 * complete or details call. The SDK can only be told through the listener of a
 * signed call, so keep it until the next token list reports it.
 */
let pendingAttestationRequirement: string | undefined;

/**
 * Reports the saved requirement, by fetching the token list again.
 */
let reportAttestationRequirement: (() => void) | undefined;

/**
 * @param reportSoon Report the requirement right after this call, instead of
 *   on the next token list. Use it for calls that don't change the token id, as
 *   a new token id fetches the token list anyway.
 */
export const saveAttestationRequirement = (
  headers: Record<string, unknown>,
  {reportSoon = false}: {reportSoon?: boolean} = {},
) => {
  const requirement = headers[AttestationRequirementHeaderName];
  if (typeof requirement !== 'string' || !requirement) return;
  pendingAttestationRequirement = requirement;
  // After this call, so the SDK finishes it before the token list is fetched
  if (reportSoon) setTimeout(() => reportAttestationRequirement?.(), 0);
};

/**
 * Returns the saved reattestation requirement, if any, and forgets it.
 */
export const takeAttestationRequirement = () => {
  const requirement = pendingAttestationRequirement;
  pendingAttestationRequirement = undefined;
  return requirement;
};

/**
 * Forgets the saved reattestation requirement, so it isn't reported for the
 * next user's token.
 */
export const clearAttestationRequirement = () => {
  pendingAttestationRequirement = undefined;
};

export const setAttestationRequirementReporter = (
  report: (() => void) | undefined,
) => {
  reportAttestationRequirement = report;
};
