import {useEffect} from 'react';
import {useIntercomMetadata} from '@atb/chat';
import {AuthReducerState} from '@atb/auth/AuthContext';
import {mapAuthenticationType} from '@atb/auth/utils';

export const useUpdateIntercomOnUserChange = (state: AuthReducerState) => {
  const {updateMetadata} = useIntercomMetadata();

  useEffect(() => {
    updateMetadata({
      'AtB-Firebase-Auth-Id': state.user?.uid,
      'AtB-Auth-Type': mapAuthenticationType(state.user),
    });
  }, [state.user, updateMetadata]);
};
