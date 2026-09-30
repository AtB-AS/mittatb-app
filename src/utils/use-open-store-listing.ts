import {Platform} from 'react-native';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useMutation} from '@tanstack/react-query';
import {openUrlOrThrow} from './open-url';

/**
 * Open the app's store listing for the current platform and language.
 */
export const useOpenStoreListing = () => {
  const {language} = useTranslation();
  const {configurableLinks} = useFirestoreConfigurationContext();
  const {mutate, isError, isPending} = useMutation({
    mutationFn: () =>
      openUrlOrThrow(
        Platform.select({
          ios: getTextForLanguage(configurableLinks?.iosStoreListing, language),
          android: getTextForLanguage(
            configurableLinks?.androidStoreListing,
            language,
          ),
          default: '',
        }),
      ),
  });

  return {openStoreListing: () => mutate(), isError, isPending};
};
