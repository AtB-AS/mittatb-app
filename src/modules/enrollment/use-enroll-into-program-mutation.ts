import {useMutation, useQueryClient} from '@tanstack/react-query';
import {enrollIntoProgram} from './api/api';
import {GET_ENROLLMENTS_KEY} from './use-get-enrollments-query';
import {EnrollmentType} from './types';

const ENROLL_INTO_PROGRAM_KEY = 'ENROLL_INTO_PROGRAM';

export const useEnrollIntoProgramMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<EnrollmentType, Error, string>({
    mutationKey: [ENROLL_INTO_PROGRAM_KEY],
    mutationFn: (code: string) => enrollIntoProgram(code),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_ENROLLMENTS_KEY],
      });
    },
  });
};
