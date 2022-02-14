import merge from 'lodash.merge';
import {AppOrgs} from '../../types/app-orgs';
import {APP_ORG} from '@env';

type Overrides<T> = {
  [P in keyof T]?: Overrides<T[P]>;
};
export default function orgSpecificTranslations<T>(
  translationTexts: T,
  overrides: Partial<{[org in AppOrgs]: Overrides<T>}>,
) {
  return merge(translationTexts, overrides[APP_ORG]);
}
