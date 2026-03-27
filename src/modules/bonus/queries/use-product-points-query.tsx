import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/modules/auth';
import {getProductPoints} from '../api/api';

export const useProductPointsQuery = () => {
  const {authStatus} = useAuthContext();
  const {authenticationType} = useAuthContext();
  const isEnabled =
    authStatus === 'authenticated' && authenticationType === 'phone';

  return useQuery({
    enabled: isEnabled,
    queryKey: ['productPoints'],
    queryFn: getProductPoints,
  });
};
