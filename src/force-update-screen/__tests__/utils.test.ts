import {isCurrentAppVersionLowerThanMinVersion} from './../utils.ts';
import {compareVersion} from '@atb/utils/compare-version.ts';

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

describe('compareVersion', () => {
  test('should return -1 if appVersion is smaller than minAppVersion', () => {
    expect(compareVersion('1.2.3', '1.2.4')).toBe(-1);
    expect(compareVersion('1.2.0', '1.2.1')).toBe(-1);
    expect(compareVersion('1.2', '1.2.1')).toBe(-1);
    expect(compareVersion('1.2.3', '1.3.0')).toBe(-1);
    expect(compareVersion('1.2.3', '2.0.0')).toBe(-1);
  });
  test('should return 0 if appVersion is equal to minAppVersion', () => {
    expect(compareVersion('1.2.3', '1.2.3')).toBe(0);
    expect(compareVersion('1.2', '1.2.0')).toBe(0);
  });
  test('should return 1 if appVersion is greater than minAppVersion', () => {
    expect(compareVersion('1.2.4', '1.2.3')).toBe(1);
    expect(compareVersion('1.3.0', '1.2.3')).toBe(1);
    expect(compareVersion('2.0.3', '1.2.0')).toBe(1);
    expect(compareVersion('2.3.1', '2.1.2')).toBe(1);
    expect(compareVersion('2.1.1', '2.0.2')).toBe(1);
    expect(compareVersion('2.0.0', '1.2.3')).toBe(1);
  });
  test('should handle versions with different lengths correctly', () => {
    expect(compareVersion('1.2', '1.2.0')).toBe(0);
    expect(compareVersion('1.2', '1.3')).toBe(-1);
    expect(compareVersion('1.2.0', '1.2')).toBe(0);
    expect(compareVersion('1.0.0', '1')).toBe(0);
  });

  test('should return false if minAppVersion or appVersion is missing', () => {
    expect(compareVersion('', '1.2.3')).toBe(undefined);
    expect(compareVersion('1.2.3', '')).toBe(undefined);
    expect(compareVersion('', '')).toBe(undefined);
    // expect(compareVersion(undefined, '1.2.3')).toBe(false);
    // expect(compareVersion('1.2.3', undefined)).toBe(false);
    // expect(compareVersion(undefined, undefined)).toBe(false);
  });

  test('should handle edge cases correctly', () => {
    expect(compareVersion('0.0.0', '0.0.0')).toBe(0);
    expect(compareVersion('0.0.0', '0.0.1')).toBe(-1);
    expect(compareVersion('0.0.1', '0.0.0')).toBe(1);
  });
});
