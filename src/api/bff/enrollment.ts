import qs from 'query-string';
import {client} from '../client';
import {stringifyUrl} from '../utils';

type EnrollmentResponse =
  | {
      status: 'expired';
    }
  | {status: 'ok'; groups: string[]; enrollmentId: string};

export async function enrollIntoBetaGroups(inviteKey: string) {
  const url = 'bff/v1/enrollment/group';
  const query = qs.stringify({
    inviteKey,
  });

  return await client.post<EnrollmentResponse>(
    stringifyUrl(url, query),
    undefined,
    {
      authWithIdToken: true,
      skipErrorLogging: (error) => error.response?.status === 422,
    },
  );
}
