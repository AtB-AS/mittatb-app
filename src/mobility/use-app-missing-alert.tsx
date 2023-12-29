import {Alert, AlertButton, Linking} from 'react-native';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useTranslation} from '@atb/translations';
import {useCallback} from 'react';

export const useAppMissingAlert = () => {
  const {t} = useTranslation();

  const appStoreOpenError = useCallback(
    (operatorName: string) => {
      const appStore = t(MobilityTexts.appStore());
      Alert.alert(
        '',
        t(MobilityTexts.appStoreOpenError.text(appStore, operatorName)),
        [
          {
            text: t(MobilityTexts.appStoreOpenError.button),
            style: 'cancel',
          },
        ],
      );
    },
    [t],
  );

  type AppMissingAlertArgs = {
    operatorName: string;
    appStoreUri: string | undefined;
  };
  const showAppMissingAlert = useCallback(
    ({appStoreUri, operatorName}: AppMissingAlertArgs) => {
      const buttons: AlertButton[] = [
        {
          text: t(MobilityTexts.appMissingAlert.buttons.cancel),
          style: 'cancel',
        },
      ];
      if (appStoreUri) {
        buttons.push({
          text: t(
            MobilityTexts.appMissingAlert.buttons.openAppStore(
              t(MobilityTexts.appStore()),
            ),
          ),
          style: 'default',
          onPress: () =>
            Linking.openURL(appStoreUri).catch(() =>
              appStoreOpenError(operatorName),
            ),
        });
      }
      Alert.alert(
        t(MobilityTexts.appMissingAlert.title(operatorName)),
        t(MobilityTexts.appMissingAlert.text(operatorName)),
        buttons,
      );
    },
    [appStoreOpenError, t],
  );

  return {showAppMissingAlert};
};
