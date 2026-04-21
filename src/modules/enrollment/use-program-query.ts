import {useQuery} from '@tanstack/react-query';
import {getProgram} from './api/api';
import {KnownProgramId, ProgramType} from './types';
import {ONE_HOUR_MS} from '@atb/utils/durations';

export const GET_PROGRAM_KEY = 'GET_PROGRAM';

export function useProgramQuery(
  programId: KnownProgramId,
  disabled: boolean = false,
): ProgramType | undefined {
  const {data} = useQuery({
    queryKey: [GET_PROGRAM_KEY, programId],
    queryFn: () => getProgram(programId),
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
    refetchOnWindowFocus: 'always',
    enabled: !disabled,
  });

  return data;
}
