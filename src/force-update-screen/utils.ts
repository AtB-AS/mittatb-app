export const isCurrentAppVersionLowerThanMinVersion = (
  appVersion?: string,
  minAppVersion?: string,
) => {
  const splitAndNormalize = (version: string) => {
    const parts: number[] = version.split('.').map(Number);
    while (parts.length < 3) {
      parts.push(0);
    }
    return parts;
  };

  if (minAppVersion && appVersion) {
    const currentAppVersionList = splitAndNormalize(appVersion);
    const minAppVersionList = splitAndNormalize(minAppVersion);

    for (let i = 0; i < 3; i++) {
      if (currentAppVersionList[i] < minAppVersionList[i]) {
        return true;
      } else if (currentAppVersionList[i] > minAppVersionList[i]) {
        return false;
      }
    }
  }
  return false;
};
