import {isCurrentAppVersionLowerThanMinVersion} from './../utils.ts';

describe('enforceUpdateOfAppVersion', () => {
  test('should return true if appVersion is smaller than minAppVersion', () => {
    expect(isCurrentAppVersionLowerThanMinVersion('1.2.3', '1.2.4')).toBe(true);
    expect(isCurrentAppVersionLowerThanMinVersion('1.2.0', '1.2.1')).toBe(true);
    expect(isCurrentAppVersionLowerThanMinVersion('1.2', '1.2.1')).toBe(true);
    expect(isCurrentAppVersionLowerThanMinVersion('1.2.3', '1.3.0')).toBe(true);
    expect(isCurrentAppVersionLowerThanMinVersion('1.2.3', '2.0.0')).toBe(true);
  });
  test('should return false if appVersion is equal to minAppVersion', () => {
    expect(isCurrentAppVersionLowerThanMinVersion('1.2.3', '1.2.3')).toBe(
      false,
    );
    expect(isCurrentAppVersionLowerThanMinVersion('1.2', '1.2.0')).toBe(false);
  });
  test('should return false if appVersion is greater than minAppVersion', () => {
    expect(isCurrentAppVersionLowerThanMinVersion('1.2.4', '1.2.3')).toBe(
      false,
    );
    expect(isCurrentAppVersionLowerThanMinVersion('1.3.0', '1.2.3')).toBe(
      false,
    );
    expect(isCurrentAppVersionLowerThanMinVersion('2.0.3', '1.2.0')).toBe(
      false,
    );
    expect(isCurrentAppVersionLowerThanMinVersion('2.3.1', '2.1.2')).toBe(
      false,
    );
    expect(isCurrentAppVersionLowerThanMinVersion('2.1.1', '2.0.2')).toBe(
      false,
    );
    expect(isCurrentAppVersionLowerThanMinVersion('2.0.0', '1.2.3')).toBe(
      false,
    );
  });
  test('should handle versions with different lengths correctly', () => {
    expect(isCurrentAppVersionLowerThanMinVersion('1.2', '1.2.0')).toBe(false);
    expect(isCurrentAppVersionLowerThanMinVersion('1.2', '1.3')).toBe(true);
    expect(isCurrentAppVersionLowerThanMinVersion('1.2.0', '1.2')).toBe(false);
    expect(isCurrentAppVersionLowerThanMinVersion('1.0.0', '1')).toBe(false);
  });

  test('should return false if minAppVersion or appVersion is missing', () => {
    expect(isCurrentAppVersionLowerThanMinVersion('', '1.2.3')).toBe(false);
    expect(isCurrentAppVersionLowerThanMinVersion('1.2.3', '')).toBe(false);
    expect(isCurrentAppVersionLowerThanMinVersion('', '')).toBe(false);
    expect(isCurrentAppVersionLowerThanMinVersion(undefined, '1.2.3')).toBe(
      false,
    );
    expect(isCurrentAppVersionLowerThanMinVersion('1.2.3', undefined)).toBe(
      false,
    );
    expect(isCurrentAppVersionLowerThanMinVersion(undefined, undefined)).toBe(
      false,
    );
  });

  test('should handle edge cases correctly', () => {
    expect(isCurrentAppVersionLowerThanMinVersion('0.0.0', '0.0.0')).toBe(
      false,
    );
    expect(isCurrentAppVersionLowerThanMinVersion('0.0.0', '0.0.1')).toBe(true);
    expect(isCurrentAppVersionLowerThanMinVersion('0.0.1', '0.0.0')).toBe(
      false,
    );
  });
});
