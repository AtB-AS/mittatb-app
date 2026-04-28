import {useAuthContext} from '@atb/modules/auth';
import {useGetEnrollmentsQuery} from './use-get-enrollments-query';
import {EnrollmentType} from './types';

export function useGetEnrollments(disabled: boolean = false): EnrollmentType[] {
  const {isLoggedIn} = useAuthContext();
  const {data} = useGetEnrollmentsQuery(!isLoggedIn || disabled);
  return data ?? [];
}
