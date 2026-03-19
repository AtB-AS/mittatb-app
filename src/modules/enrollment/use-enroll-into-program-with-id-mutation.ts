import {useMutation, useQueryClient} from '@tanstack/react-query';
import {enrollIntoProgramWithId} from './api/api';
import {GET_ENROLLMENTS_KEY} from './use-get-enrollments-query';
import {EnrollmentType} from './types';

const ENROLL_INTO_PROGRAM_WITH_ID_KEY = 'ENROLL_INTO_PROGRAM_WITH_ID';

export const useEnrollIntoProgramWithIdMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<EnrollmentType, Error, string>({
    mutationKey: [ENROLL_INTO_PROGRAM_WITH_ID_KEY],
    mutationFn: (id: string) => enrollIntoProgramWithId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_ENROLLMENTS_KEY],
      });
    },
  });
};
