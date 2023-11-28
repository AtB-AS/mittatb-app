import {z} from 'zod';

export type NotificationConfigType = 'mode' | 'group';

export interface NotificationConfigValue {
  id: string;
  enabled: boolean;
}

export interface NotificationConfigMode extends NotificationConfigValue {
  id: 'push' | 'mail';
}

export interface NotificationConfigGroup extends NotificationConfigValue {
  id: 'single' | 'period' | 'night' | 'carnet';
}

export type NotificationConfig = {
  modes: NotificationConfigMode[];
  groups: NotificationConfigGroup[];
};

export enum PushNotificationPayloadType {
  activeFareContracts = 'ACTIVE_FARE_CONTRACTS',
}

// Can be updated to z.union when we add more types:
// `z.union([z.object({type: a}), z.object({type: b})])`
export const PushNotificationData = z.object({
  type: z.literal(PushNotificationPayloadType.activeFareContracts),
  fareContractId: z.string(),
});
