import {Alert} from 'react-native';

type destructiveAlertProps = {
  confirmMessageString: string;
  cancelAlertString: string;
  confirmAlertString: string;
  destructiveArrowFunction: () => void;
};

export const destructiveAlert = ({
  confirmMessageString,
  cancelAlertString,
  confirmAlertString,
  destructiveArrowFunction,
}: destructiveAlertProps): void =>
  Alert.alert(confirmMessageString, undefined, [
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
