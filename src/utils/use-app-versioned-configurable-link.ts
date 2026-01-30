import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useTranslation, getTextForLanguage} from '@atb/translations';
import {getAppVersionedItem} from './converters';
import {
  ConfigurableLinks,
  AppVersionedConfigurableLink,
} from '@atb-as/config-specs';
import {KeysMatching} from './types';

// find every key in configurableLinks where the value is of type AppVersionedConfigurableLink[] | undefined
type AppVersionedConfigurableLinkKey = KeysMatching<
  ConfigurableLinks,
  AppVersionedConfigurableLink[] | undefined
>;

/**
 * Returns the url string matching app version and language
 * from a list of AppVersionedConfigurableLinks.
 */
export const useAppVersionedConfigurableLink = (
  name: AppVersionedConfigurableLinkKey,
): string | undefined => {
  const {language} = useTranslation();
  const {configurableLinks} = useFirestoreConfigurationContext();

  const appVersionedConfigurableLink = getAppVersionedItem(
    configurableLinks?.[name],
  )?.configurableLink;

  return getTextForLanguage(appVersionedConfigurableLink, language);
};
