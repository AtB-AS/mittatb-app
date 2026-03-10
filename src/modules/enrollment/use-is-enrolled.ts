import {useMemo} from 'react';
import {useGetEnrollmentsQuery} from './use-get-enrollments-query';
import {KnownProgramId} from './types';

export function useIsEnrolled(programId: KnownProgramId): boolean {
  const {data: enrollments} = useGetEnrollmentsQuery();

  return useMemo(() => {
    if (!enrollments) return false;
    return enrollments.some(
      (e) => e.programId === programId && e.programIsActive,
    );
  }, [enrollments, programId]);
}
