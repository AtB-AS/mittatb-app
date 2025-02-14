import {NotificationConfigValue} from './types';
import {isDefined} from '@atb/utils/presence';

export function isConfigEnabled<T extends NotificationConfigValue>(
  config: T[] | undefined,
  key: T['id'],
): boolean {
  return config?.filter(isDefined).find((v) => v.id === key)?.enabled ?? false;
}
