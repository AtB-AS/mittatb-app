import {useEffect, useRef} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {AuthReducerState} from './AuthContext';

export const useClearQueriesOnUserChange = (state: AuthReducerState) => {
  const queryClient = useQueryClient();
  const previousUid = useRef<string>(undefined);
  const uid = state.user?.uid;
  useEffect(() => {
    if (!uid) return;
    if (previousUid.current && previousUid.current !== uid) queryClient.clear();
    previousUid.current = uid;
  }, [uid, queryClient]);
};
