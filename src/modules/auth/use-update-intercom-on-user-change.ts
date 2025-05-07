import {useEffect} from 'react';
import {useIntercomMetadata} from '@atb/modules/chat';
import {AuthReducerState} from './AuthContext';
import {mapAuthenticationType} from './utils';

export const useUpdateIntercomOnUserChange = (state: AuthReducerState) => {
  const {updateMetadata} = useIntercomMetadata();

  useEffect(() => {
    updateMetadata({
      'AtB-Firebase-Auth-Id': state.user?.uid,
      'AtB-Auth-Type': mapAuthenticationType(state.user),
    });
  }, [state.user, updateMetadata]);
};
