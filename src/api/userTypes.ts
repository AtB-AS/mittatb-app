import userTypes from '../assets/mock-responses/userTypes.json';

export async function list(): Promise<UserType[]> {
  return userTypes as UserType[];
}

type Language = 'nob' | 'nno' | 'eng';

type LanguageAndText = {
  lang: Language;
  value: string;
};

export type UserType = {
  id: string;
  minAge?: number;
  maxAge: number;
  userType: number;
  name: LanguageAndText;
  alternativeNames: LanguageAndText[];
  description: LanguageAndText;
};
