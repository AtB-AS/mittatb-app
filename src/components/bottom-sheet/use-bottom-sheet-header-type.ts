import {Close, Confirm} from '@atb/assets/svg/mono-icons/actions';
import {dictionary, useTranslation} from '@atb/translations';

export enum BottomSheetHeaderType {
  Close = 'Close',
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
