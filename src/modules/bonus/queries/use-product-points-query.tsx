import {useQuery} from '@tanstack/react-query';
import {useAuthContext, isLoggedInAuthenticationType} from '@atb/modules/auth';
import {getProductPoints} from '../api/api';

export const useProductPointsQuery = () => {
  const {authStatus} = useAuthContext();
  const {authenticationType} = useAuthContext();
  const isEnabled =
    authStatus === 'authenticated' &&
    isLoggedInAuthenticationType(authenticationType);

  return useQuery({
    enabled: isEnabled,
    queryKey: ['productPoints'],
    queryFn: getProductPoints,
  });
};
