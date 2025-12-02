import React from 'react';
import {useTranslation} from '@atb/translations';
import {getTextForLanguage} from '@atb/translations';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {DashboardTexts} from '@atb/translations';
import {AccessibilityRole, Linking} from 'react-native';
import Bugsnag from '@bugsnag/react-native';
import {SvgProps} from 'react-native-svg';
import {RefObject, useCallback} from 'react';
import {
  ActionType,
  Announcement,
  BottomSheetActionButton,
  UrlActionButton,
  isBottomSheetAnnouncement,
} from '@atb/modules/announcements';
import {AnalyticsEventContext} from '@atb/modules/analytics';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {openInAppBrowser} from '@atb/modules/in-app-browser';

type ActionButtonProps = {
  rightIcon: {svg: (props: SvgProps) => React.JSX.Element};
  text: string;
  accessibilityHint: string;
  accessibilityRole: AccessibilityRole;
  onPress: () => void;
};

export const useActionButtonProps = (
  announcement: Announcement,
  button: UrlActionButton | BottomSheetActionButton | undefined,
  logContext: AnalyticsEventContext,
  bottomSheetModalRef: RefObject<BottomSheetModal | null>,
): ActionButtonProps | undefined => {
  const {language, t} = useTranslation();
  const analytics = useAnalyticsContext();

  const logPress = useCallback(() => {
    analytics.logEvent(logContext, 'Announcement pressed', {
      id: announcement.id,
    });
  }, [analytics, logContext, announcement.id]);

  if (!button) return undefined;

  const summaryTitle = getTextForLanguage(
    announcement.summaryTitle ?? announcement.fullTitle,
    language,
  );

  const accessibilityRole: AccessibilityRole =
    button.actionType === ActionType.bottom_sheet ? 'button' : 'link';

  const actionHandlers = {
    [ActionType.external]: async (url: string) => {
      await openInAppBrowser(url, 'close');
    },
    [ActionType.deeplink]: async (url: string) => {
      await Linking.openURL(url);
    },
  };

  return {
    rightIcon:
      button.actionType === ActionType.external
        ? {svg: ExternalLink}
        : {svg: ArrowRight},
    text:
      getTextForLanguage(button.label, language) ??
      t(DashboardTexts.announcements.buttonAction.defaultLabel(summaryTitle)),
    accessibilityHint: t(
      DashboardTexts.announcements.buttonAction.a11yHint[
        button.actionType as ActionType
      ],
    ),
    accessibilityRole,
    onPress: async () => {
      logPress();
      if (
        button.actionType === ActionType.bottom_sheet &&
        isBottomSheetAnnouncement(announcement)
      ) {
        bottomSheetModalRef.current?.present();
      } else if (
        button.actionType === ActionType.external ||
        button.actionType === ActionType.deeplink
      ) {
        const actionButtonURL = button.url;
        try {
          actionButtonURL && actionHandlers[button.actionType](actionButtonURL);
        } catch (err: any) {
          Bugsnag.notify(err);
        }
      }
    },
  };
};
