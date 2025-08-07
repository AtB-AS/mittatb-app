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

export const secondsToTokenExpiry = (idTokenExpirationTime: string) =>
  secondsBetween(new Date(), new Date(idTokenExpirationTime));

type IdTokenValidityStatus = 'valid' | 'expiring' | 'expired';

export const getIdTokenValidityStatus = (
  idTokenResult: string | undefined,
): IdTokenValidityStatus | undefined => {
  if (idTokenResult === undefined) return;

  const expirationTime = secondsToTokenExpiry(idTokenResult);

  if (expirationTime > 300) return 'valid';
  else if (expirationTime <= 300 && expirationTime > 0) return 'expiring';
  else return 'expired';
};
