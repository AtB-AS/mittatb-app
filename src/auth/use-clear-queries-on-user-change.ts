import {useEffect} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {AuthReducerState} from '@atb/auth/AuthContext';

export const useClearQueriesOnUserChange = (state: AuthReducerState) => {
  const queryClient = useQueryClient();
  useEffect(() => queryClient.clear(), [state.user?.uid, queryClient]);
};
