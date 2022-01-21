import qs from 'query-string';
import {bffClient} from './client';
import {stringifyUrl} from './utils';

type EnrollmentResponse =
  | {
      status: 'expired';
    }
  | {status: 'ok'; groups: string[]};

export async function enrollIntoBetaGroups(inviteKey: string) {
  const url = 'bff/v1/enrollment/group';
  const query = qs.stringify({
    inviteKey,
  });

  return await bffClient.post<EnrollmentResponse>(
    stringifyUrl(url, query),
    undefined,
    {
      skipErrorLogging: (error) => error.response?.status === 422,
    },
  );
}
