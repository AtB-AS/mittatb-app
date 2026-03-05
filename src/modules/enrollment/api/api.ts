import {client} from '@atb/api';
import {Enrollment, EnrollmentType} from '../types';
import z from 'zod';

export async function enrollIntoProgram(inviteKey: string) {
  const url = 'enrollment/v2';
  const body = {code: inviteKey};

  return await client
    .post<EnrollmentType>(url, body, {
      authWithIdToken: true,
      skipErrorLogging: (error) => error.response?.status === 422,
    })
    .then((response) => Enrollment.parse(response.data));
}

export async function getEnrollments() {
  const url = 'enrollment/v2';

  return await client
    .get<EnrollmentType[]>(url, {
      authWithIdToken: true,
    })
    .then((response) => z.array(Enrollment).parse(response.data));
}
