import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export async function getAbtCustomerId(user: FirebaseAuthTypes.User) {
  const idTokenResult = await user.getIdTokenResult();
  return idTokenResult.claims['abt_id'];
}
