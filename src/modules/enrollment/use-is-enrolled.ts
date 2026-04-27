import {useMemo} from 'react';
import {useGetEnrollments} from './use-get-enrollments';
import {KnownProgramId} from './types';

export function useIsEnrolled(
  programId: KnownProgramId,
  disabled: boolean = false,
): boolean {
  const enrollments = useGetEnrollments(disabled);

  return useMemo(() => {
    return enrollments.some(
      (e) => e.programId === programId && e.programIsActive,
    );
  }, [enrollments, programId]);
}
