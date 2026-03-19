import {useMutation, useQueryClient} from '@tanstack/react-query';
import {enrollIntoProgramWithCode} from './api/api';
import {GET_ENROLLMENTS_KEY} from './use-get-enrollments-query';
import {EnrollmentType} from './types';

const ENROLL_INTO_PROGRAM_WITH_CODE_KEY = 'ENROLL_INTO_PROGRAM_WITH_CODE';

export const useEnrollIntoProgramWithCodeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<EnrollmentType, Error, string>({
    mutationKey: [ENROLL_INTO_PROGRAM_WITH_CODE_KEY],
    mutationFn: (code: string) => enrollIntoProgramWithCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_ENROLLMENTS_KEY],
      });
    },
  });
};
