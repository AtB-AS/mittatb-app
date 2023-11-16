import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {AuthenticationType} from './types';

export const mapAuthenticationType = (
  user: FirebaseAuthTypes.User | undefined,
): AuthenticationType => {
  if (user?.phoneNumber) return 'phone';
  else if (user?.isAnonymous) return 'anonymous';
  else return 'none';
};
