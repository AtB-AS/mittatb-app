import {client} from '../client';

type EnrollmentResponse =
  | {
      status: 'expired';
    }
  | {status: 'ok'; groups: string[]; enrollmentId: string};

export async function enrollIntoBetaGroups(inviteKey: string) {
  const url = 'enrollment/v2';
  const body = {code: inviteKey};

  return await client.post<EnrollmentResponse>(url, body, {
    authWithIdToken: true,
    skipErrorLogging: (error) => error.response?.status === 422,
  });
}
