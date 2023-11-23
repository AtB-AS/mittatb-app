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

export type NotificationPayload = {
  type: NotificationPayloadType.fareContractExpiry;
  fareContractId: string;
};

export enum NotificationPayloadType {
  fareContractExpiry = 'FARE_CONTRACT_EXPIRY',
}
