export function compareVersion(versionA: string, versionB: string) {
  const A = versionA.split('.');
  const B = versionB.split('.');
  for (let i = 0; i < Math.min(A.length, B.length); i++) {
    if (A[i] !== B[i]) {
      return parseInt(A[i]) > parseInt(B[i]) ? 1 : -1;
    }
  }
  if (A.length === B.length) {
    return 0;
  } else if (A.length > B.length) {
    return 1;
  }
  return -1;
}
