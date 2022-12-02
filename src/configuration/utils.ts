import Bugsnag from '@bugsnag/react-native';
import {useFirestoreConfiguration} from './FirestoreConfigurationContext';

export const useFareProductConfig = (type: string) => {
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
