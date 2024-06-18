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

export const verifySms = async (
  phoneNumber: string,
  code: string,
): Promise<string> => {
  const result = await client.post<string>('/identity/v1/sms/verify', {
    code,
    phoneNumber,
  });
  return result.data;
};
