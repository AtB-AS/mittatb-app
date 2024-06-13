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

type VerifySmsResponse = {
  token?: string;
  /**
   * Status codes from Twilio:
   * https://www.twilio.com/docs/verify/api/verification-check
   */
  status:
    | 'pending'
    | 'approved'
    | 'canceled'
    | 'max_attempts_reached'
    | 'deleted'
    | 'failed'
    | 'expired';
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
