import {useTranslation} from '@atb/translations';
import {Alert, AlertButton, Linking} from 'react-native';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useCallback} from 'react';
import {useAnalytics} from '@atb/analytics';

type OpenOperatorAppArgs = {
  operatorName: string;
  appStoreUri: string | undefined;
  rentalAppUri: string | undefined;
};
type AppMissingAlertArgs = Pick<
  OpenOperatorAppArgs,
  'appStoreUri' | 'operatorName'
>;

export const useOperatorApp = () => {
  const analytics = useAnalytics();
  const {t} = useTranslation();

  const appStoreOpenError = (operatorName: string) => {
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
  };

  const appMissingAlert = ({
    appStoreUri,
    operatorName,
  }: AppMissingAlertArgs) => {
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
  };

  const openOperatorApp = useCallback(
    async ({operatorName, appStoreUri, rentalAppUri}: OpenOperatorAppArgs) => {
      analytics.logEvent('Mobility', 'Open operator app', {operatorName});
      if (!rentalAppUri) return;
      await Linking.openURL(rentalAppUri).catch(() =>
        appMissingAlert({appStoreUri, operatorName}),
      );
    },
    [],
  );

  return {
    appMissingAlert,
    openOperatorApp,
  };
};
