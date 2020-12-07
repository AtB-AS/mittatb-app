import {LanguageAndText} from './utils';
import client from './client';

export async function list(): Promise<UserProfile[]> {
  const url =
    'https://atb-netex-resolver-staging-jlmnrncfba-ew.a.run.app/reference-data/v1/ATB/user-profiles';
  const response = await client.get<UserProfile[]>(url);
  return response.data;
}

export type UserProfile = {
  id: string;
  minAge?: number;
  maxAge: number;
  userType: number;
  userTypeString: string;
  name: LanguageAndText;
  alternativeNames: LanguageAndText[];
  description: LanguageAndText;
};
