/**
 * Compares two version strings in the format "x.y.z" and returns:
 * - 1 if versionA is greater than versionB,
 * - -1 if versionB is greater than versionA,
 * - 0 if they are equal.
 */
export function compareVersion(versionA: string, versionB: string) {
  if (!versionA || !versionB) return NaN;

  const maxLength = Math.max(versionA.length, versionB.length);

  const splitAndNormalize = (version: string) => {
    const parts = version.split('.').map(Number);
    // Normalize to 3 parts by adding zeros if necessary
    while (parts.length < maxLength) {
      parts.push(0);
    }
    return parts;
  };

  const vA = splitAndNormalize(versionA);
  const vB = splitAndNormalize(versionB);

  // Compare each component
  for (let i = 0; i < maxLength; i++) {
    if (vA[i] > vB[i]) return 1; // versionA is greater
    if (vA[i] < vB[i]) return -1; // versionB is greater
  }

  return 0; // versions are equal
}
