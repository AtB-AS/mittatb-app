import {Alert} from 'react-native';

type destructiveAlertProps = {
  alertTitleString: string;
  alertMessageString?: string;
  cancelAlertString: string;
  confirmAlertString: string;
  destructiveArrowFunction: () => void;
};

export const destructiveAlert = ({
  alertTitleString,
  alertMessageString,
  cancelAlertString,
  confirmAlertString,
  destructiveArrowFunction,
}: destructiveAlertProps): void =>
  Alert.alert(alertTitleString, alertMessageString, [
    {
      text: cancelAlertString,
      style: 'cancel',
    },
    {
      text: confirmAlertString,
      style: 'destructive',
      onPress: destructiveArrowFunction,
    },
  ]);
