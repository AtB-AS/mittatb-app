import {FareProductTypeConfig} from '@atb/screens/Ticketing/FareContracts/utils';
import Bugsnag from '@bugsnag/react-native';
import {useFirestoreConfiguration} from './FirestoreConfigurationContext';

export const useFareProductTypeConfig = (
  type: string,
): FareProductTypeConfig => {
  const {fareProductTypeConfigs} = useFirestoreConfiguration();

  const productConfig = fareProductTypeConfigs.find(
    (config) => config.type === type,
  );

  if (!productConfig) {
    const errorMessage = `error trying find a configuration for type: ${type}`;
    Bugsnag.notify(errorMessage);
    throw errorMessage;
  }

  return productConfig;
};
