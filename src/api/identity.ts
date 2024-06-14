import {Language} from '@atb/translations';
import {client} from './client';

export const authenticateWithSms = async (
  phoneNumber: string,
  language: Language,
) => {
  await client.post('/identity/v1/sms', {
    phoneNumber,
    language,
  });
};

/**
 * Status codes from Twilio:
 * https://www.twilio.com/docs/verify/api/verification-check
 */
export enum TwilioStatus {
  /** Authentication succeeded */
  APPROVED = 'approved',
  /** The user entered the wrong OTP code */
  PENDING = 'pending',
  CANCELED = 'canceled',
  /** 5 attempts to verify the code failed */
  MAX_ATTEMPTS_REACHED = 'max_attempts_reached',
  DELETED = 'deleted',
  FAILED = 'failed',
  /** 10 minutes passed since the code was sent */
  EXPIRED = 'expired',
}
type VerifySmsResponse = {
  token?: string;
  status: TwilioStatus;
};
export const verifySms = async (
  phoneNumber: string,
  code: string,
): Promise<VerifySmsResponse> => {
  const result = await client.post<VerifySmsResponse>(
    '/identity/v1/sms/verify',
    {
      code,
      phoneNumber,
    },
  );
  return result.data;
};
