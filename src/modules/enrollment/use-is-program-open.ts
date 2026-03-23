import {useQuery} from '@tanstack/react-query';
import {getProgram} from './api/api';
import {KnownProgramId} from './types';
import {ONE_HOUR_MS} from '@atb/utils/durations';

const GET_PROGRAM_KEY = 'GET_PROGRAM';

export function useIsProgramOpen(programId: KnownProgramId): boolean {
  const {data: program} = useQuery({
    queryKey: [GET_PROGRAM_KEY, programId],
    queryFn: () => getProgram(programId),
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
  });

  return program?.isOpen ?? false;
}
