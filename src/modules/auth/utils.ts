import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {AuthenticationType} from './types';
import {secondsBetween} from '@atb/utils/date';

export const mapAuthenticationType = (
  user: FirebaseAuthTypes.User | undefined,
): AuthenticationType => {
  if (user?.phoneNumber) return 'phone';
  else if (user?.isAnonymous) return 'anonymous';
  else return 'none';
};

export const secondsToTokenExpiry = (
  idTokenResult: FirebaseAuthTypes.IdTokenResult,
) => secondsBetween(new Date(), new Date(idTokenResult.expirationTime));
