import {useEffect} from 'react';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {updateMetadata} from '@atb/chat/metadata';
import {AuthReducerState} from '@atb/auth/AuthContext';
import {mapAuthenticationType} from '@atb/auth/utils';

export const useUpdateIntercomOnUserChange = (state: AuthReducerState) => {
  const {enable_intercom} = useRemoteConfig();

  useEffect(() => {
    if (enable_intercom) {
      updateMetadata({
        'AtB-Firebase-Auth-Id': state.user?.uid,
        'AtB-Auth-Type': mapAuthenticationType(state.user),
      });
    }
  }, [state.user, enable_intercom]);
};
