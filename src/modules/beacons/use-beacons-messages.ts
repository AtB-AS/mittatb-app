import {
  ShareTravelHabitsTexts,
  dictionary,
  useTranslation,
} from '@atb/translations';
import {useMemo} from 'react';
import {PermissionKey} from './permissions';
import {Rationale} from 'react-native-permissions';

export type RationaleMessages = Record<PermissionKey, Rationale>;

export const useBeaconsMessages = () => {
  const {t} = useTranslation();

  const rationaleMessages = useMemo((): RationaleMessages => {
    const buttonPositive: string = t(dictionary.messageActions.positiveButton);
    return {
      bluetooth: {
        title: t(ShareTravelHabitsTexts.permissions.bluethooth.title),
        message: t(ShareTravelHabitsTexts.permissions.bluethooth.message),
        buttonPositive,
      },
      locationWhenInUse: {
        title: t(ShareTravelHabitsTexts.permissions.locationWhenInUse.title),
        message: t(
          ShareTravelHabitsTexts.permissions.locationWhenInUse.message,
        ),
        buttonPositive,
      },
      locationAlways: {
        title: t(ShareTravelHabitsTexts.permissions.locationAlways.title),
        message: t(ShareTravelHabitsTexts.permissions.locationAlways.message),
        buttonPositive,
      },
      motion: {
        title: t(ShareTravelHabitsTexts.permissions.motion.title),
        message: t(ShareTravelHabitsTexts.permissions.motion.message),
        buttonPositive,
      },
    };
  }, [t]);

  return {
    rationaleMessages,
  };
};
