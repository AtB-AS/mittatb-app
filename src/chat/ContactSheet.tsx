import {StyleSheet, useTheme} from '@atb/theme';
import {ContactSheetTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {Linking, View} from 'react-native';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {
  BottomSheetContainer,
  useBottomSheet,
} from '@atb/components/bottom-sheet';
import {useChatUnreadCount} from './use-chat-unread-count';
import Intercom, {Space} from '@intercom/intercom-react-native';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {screenReaderHidden} from '@atb/utils/accessibility';
import {Chat} from '@atb/assets/svg/mono-icons/actions';
import {ArrowRight, ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {Button} from '@atb/components/button';
import {useAnalytics} from '@atb/analytics';
import {useParkingViolationsReportingEnabled} from '@atb/parking-violations-reporting';
import {Theme} from '@atb/theme/colors';

type Props = {
  onReportParkingViolation: () => void;
};

const getInteractiveColor = (theme: Theme) => theme.color.interactive[2]
const getBackgroundColor = (theme: Theme) => theme.color.background.neutral[0]

export const ContactSheet = ({onReportParkingViolation}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {theme} = useTheme()

  const unreadCount = useChatUnreadCount();
  const {customer_service_url, enable_intercom, customer_feedback_url} =
    useRemoteConfig();
  const analytics = useAnalytics();
  const [isParkingViolationsReportingEnabled] =
    useParkingViolationsReportingEnabled();

  const showWebsiteFeedback = !!customer_feedback_url;
  const showIntercomFeedback = enable_intercom && !showWebsiteFeedback;

  const {close} = useBottomSheet();

  return (
    <BottomSheetContainer title={t(ContactSheetTexts.header.title)}>
      <FullScreenFooter>
        <View style={styles.buttonContainer}>
          {showWebsiteFeedback ? (
            <Button
              interactiveColor={getInteractiveColor(theme)}
              text={t(ContactSheetTexts.customer_feedback_website.button)}
              accessibilityHint={t(
                ContactSheetTexts.customer_feedback_website.a11yHint,
              )}
              accessibilityRole="link"
              rightIcon={{svg: ExternalLink}}
              onPress={() => {
                Linking.openURL(customer_feedback_url);
                analytics.logEvent('Contact', 'Send customer feedback clicked');
                close();
              }}
            />
          ) : undefined}

          {showIntercomFeedback ? (
            <Button
              {...screenReaderHidden}
              text={t(ContactSheetTexts.customer_feedback.button)}
              accessibilityHint={t(
                ContactSheetTexts.customer_feedback.a11yHint,
              )}
              onPress={() => {
                unreadCount
                  ? Intercom.presentSpace(Space.messages)
                  : Intercom.presentSpace(Space.home);
                analytics.logEvent('Contact', 'Send Intercom message clicked');
                close();
              }}
              rightIcon={{
                svg: Chat,
                notification: unreadCount
                  ? {
                      color: theme.color.status.valid.primary,
                    }
                  : undefined,
              }}
            />
          ) : undefined}
          <Button
            backgroundColor={getBackgroundColor(theme)}
            text={t(ContactSheetTexts.customer_service.button)}
            accessibilityHint={t(ContactSheetTexts.customer_service.a11yHint)}
            mode="secondary"
            rightIcon={{svg: ExternalLink}}
            accessibilityRole="link"
            onPress={() => {
              Linking.openURL(customer_service_url);
              analytics.logEvent('Contact', 'Contact customer service clicked');
              close();
            }}
          />
          {isParkingViolationsReportingEnabled && (
            <Button
              backgroundColor={getBackgroundColor(theme)}
              text={t(ContactSheetTexts.parking_violations.buttonText)}
              accessibilityHint={t(
                ContactSheetTexts.parking_violations.a11yHint,
              )}
              mode="secondary"
              rightIcon={{svg: ArrowRight}}
              onPress={() => {
                onReportParkingViolation();
                analytics.logEvent(
                  'Contact',
                  'Report parking violation clicked',
                );
                close();
              }}
            />
          )}
        </View>
      </FullScreenFooter>
    </BottomSheetContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => {
  return {buttonContainer: {gap: theme.spacing.small}};
});
