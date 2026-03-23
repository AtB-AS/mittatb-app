import {client} from '@atb/api';
import {Enrollment, EnrollmentType, Program, ProgramType} from '../types';
import z from 'zod';

export async function enrollIntoProgramWithCode(code: string) {
  const url = 'enrollment/v2/enroll';
  const body = {code: code};

  return await client
    .post<EnrollmentType>(url, body, {
      authWithIdToken: true,
      skipErrorLogging: (error) => error.response?.status === 422,
    })
    .then((response) => Enrollment.parse(response.data));
}

export async function enrollIntoProgramWithId(id: string) {
  const url = `enrollment/v2/enroll/${id}`;

  return await client
    .post<EnrollmentType>(url, undefined, {
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

export async function getProgram(programId: string) {
  const url = `enrollment/v2/program/${programId}`;

  return await client
    .get<ProgramType>(url, {
      authWithIdToken: true,
    })
    .then((response) => Program.parse(response.data));
}
