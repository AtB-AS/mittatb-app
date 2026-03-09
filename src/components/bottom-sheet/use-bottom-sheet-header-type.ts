import {Close, Confirm} from '@atb/assets/svg/mono-icons/actions';
import {dictionary, useTranslation} from '@atb/translations';

export enum BottomSheetHeaderType {
  Close = 'Close',
  Cancel = 'Cancel',
  Confirm = 'Confirm',
  None = 'None',
}

export const useBottomSheetHeaderType = (type: BottomSheetHeaderType) => {
  const {t} = useTranslation();

  switch (type) {
    case BottomSheetHeaderType.Close:
      return {
        text: t(dictionary.appNavigation.close.text),
        icon: Close,
      };

    case BottomSheetHeaderType.Cancel:
      return {
        text: t(dictionary.appNavigation.cancel.text),
        icon: Close,
      };

    case BottomSheetHeaderType.Confirm:
      return {
        text: t(dictionary.confirm),
        icon: Confirm,
      };
    case BottomSheetHeaderType.None:
      return {
        text: '',
        icon: null,
      };

    default:
      return {
        text: '',
        icon: null,
      };
  }
};
