import {Alert, AlertButton, Linking} from 'react-native';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {tGlobal} from '@atb/modules/locale';

export const showAppMissingAlert = (
  operatorName: string,
  appStoreUri?: string,
) =>
  Alert.alert(
    tGlobal(MobilityTexts.appMissingAlert.title(operatorName)),
    tGlobal(MobilityTexts.appMissingAlert.text(operatorName)),
    getAlertButtons(operatorName, appStoreUri),
  );

const getAlertButtons = (operatorName: string, appStoreUri?: string) => {
  const buttons: AlertButton[] = [
    {
      text: tGlobal(MobilityTexts.appMissingAlert.buttons.cancel),
      style: 'cancel',
    },
  ];
  if (appStoreUri) {
    buttons.push({
      text: tGlobal(
        MobilityTexts.appMissingAlert.buttons.openAppStore(
          tGlobal(MobilityTexts.appStore()),
        ),
      ),
      style: 'default',
      onPress: () =>
        Linking.openURL(appStoreUri).catch(() =>
          alertAppStoreOpenError(operatorName),
        ),
    });
  }
  return buttons;
};

const alertAppStoreOpenError = (operatorName: string) => {
  const appStore = tGlobal(MobilityTexts.appStore());
  Alert.alert(
    '',
    tGlobal(MobilityTexts.appStoreOpenError.text(appStore, operatorName)),
    [
      {
        text: tGlobal(MobilityTexts.appStoreOpenError.button),
        style: 'cancel',
      },
    ],
  );
};
