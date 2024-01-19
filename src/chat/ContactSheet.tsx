import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import {ContactSheetTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {AccessibilityProps, Linking, View} from 'react-native';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {
  BottomSheetContainer,
  useBottomSheet,
} from '@atb/components/bottom-sheet';
import {useChatUnreadCount} from './use-chat-unread-count';
import Intercom from 'react-native-intercom';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {screenReaderHidden} from '@atb/utils/accessibility';
import {Chat} from '@atb/assets/svg/mono-icons/actions';
import {ArrowRight, ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {Button, ButtonProps} from '@atb/components/button';
import {useAnalytics} from '@atb/analytics';
import {useParkingViolationsReportingEnabled} from '@atb/parking-violations-reporting';

type Props = {
  onReportParkingViolation: () => void;
};

export const ContactSheet = ({onReportParkingViolation}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();

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
            <ContactItem
              buttonText={t(ContactSheetTexts.customer_feedback_website.button)}
              accessibilityHint={t(
                ContactSheetTexts.customer_feedback_website.a11yHint,
              )}
              icon={() => (
                <ThemeIcon svg={ExternalLink} colorType="background_accent_3" />
              )}
              onPress={() => {
                Linking.openURL(customer_feedback_url);
                analytics.logEvent('Contact', 'Send customer feedback clicked');
                close();
              }}
            />
          ) : undefined}

          {showIntercomFeedback ? (
            <ContactItem
              screenReaderHidden={screenReaderHidden}
              buttonText={t(ContactSheetTexts.customer_feedback.button)}
              accessibilityHint={t(
                ContactSheetTexts.customer_feedback.a11yHint,
              )}
              onPress={() => {
                unreadCount
                  ? Intercom.displayMessenger()
                  : Intercom.displayConversationsList();
                analytics.logEvent('Contact', 'Send Intercom message clicked');
                close();
              }}
              icon={() => (
                <ThemeIcon
                  colorType="background_accent_3"
                  svg={Chat}
                  notification={unreadCount ? {color: 'valid'} : undefined}
                />
              )}
            />
          ) : undefined}
          <ContactItem
            buttonText={t(ContactSheetTexts.customer_service.button)}
            accessibilityHint={t(ContactSheetTexts.customer_service.a11yHint)}
            buttonMode="secondary"
            icon={() => <ThemeIcon svg={ExternalLink} />}
            onPress={() => {
              Linking.openURL(customer_service_url);
              analytics.logEvent('Contact', 'Contact customer service clicked');
              close();
            }}
          />
          {isParkingViolationsReportingEnabled && (
            <ContactItem
              buttonText={t(ContactSheetTexts.parking_violations.buttonText)}
              accessibilityHint={t(
                ContactSheetTexts.parking_violations.a11yHint,
              )}
              buttonMode="secondary"
              icon={() => <ThemeIcon svg={ArrowRight} />}
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

type ContactProps = {
  onPress: () => void;
  icon?: () => JSX.Element;
  buttonText: string;
  accessibilityHint: string;
  focusRef?: React.ForwardedRef<View>;
  screenReaderHidden?: AccessibilityProps;
  buttonMode?: ButtonProps['mode'];
};

const ContactItem: React.FC<ContactProps> = ({
  onPress,
  icon,
  buttonText,
  accessibilityHint,
  focusRef,
  screenReaderHidden,
  buttonMode = 'primary',
}) => {
  return (
    <Button
      {...screenReaderHidden}
      ref={focusRef}
      mode={buttonMode}
      interactiveColor={
        buttonMode == 'primary' ? 'interactive_0' : 'interactive_2'
      }
      text={buttonText}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      rightIcon={icon && {svg: icon}}
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {buttonContainer: {gap: theme.spacings.small}};
});
