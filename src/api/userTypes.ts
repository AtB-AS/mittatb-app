import userTypes from '../assets/mock-responses/userTypes.json';
import {LanguageAndText} from './utils';

export async function list(): Promise<UserType[]> {
  return userTypes as UserType[];
}

export type UserType = {
  id: string;
  minAge?: number;
  maxAge: number;
  userType: number;
  name: LanguageAndText;
  alternativeNames: LanguageAndText[];
  description: LanguageAndText;
};
