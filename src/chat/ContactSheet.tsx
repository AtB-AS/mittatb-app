import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import {
  ContactSheetTexts,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import React, {forwardRef} from 'react';
import {AccessibilityProps, Linking, View} from 'react-native';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {useChatUnreadCount} from './use-chat-unread-count';
import Intercom from 'react-native-intercom';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {screenReaderHidden} from '@atb/utils/accessibility';
import {Chat} from '@atb/assets/svg/mono-icons/actions';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {Button, ButtonProps} from '@atb/components/button';

type Props = {
  close: () => void;
};

export const ContactSheet = forwardRef<View, Props>(({close}, focusRef) => {
  const {t} = useTranslation();
  const unreadCount = useChatUnreadCount();
  const {customer_service_url, enable_intercom, customer_feedback_url} =
    useRemoteConfig();

  const showWebsiteFeedback = !!customer_feedback_url;
  const showIntercomFeedback = enable_intercom && !showWebsiteFeedback;

  return (
    <BottomSheetContainer>
      <ScreenHeaderWithoutNavigation
        title={t(ContactSheetTexts.header.title)}
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        color={'background_1'}
        setFocusOnLoad={false}
      />
      <FullScreenFooter>
        {showWebsiteFeedback ? (
          <ContactItem
            body={t(ContactSheetTexts.customer_feedback_website.body)}
            buttonText={t(ContactSheetTexts.customer_feedback_website.button)}
            accessibilityHint={t(
              ContactSheetTexts.customer_feedback_website.a11yHint,
            )}
            icon={() => <ThemeIcon svg={ExternalLink} />}
            onPress={() => {
              Linking.openURL(customer_feedback_url);
              close();
            }}
          />
        ) : undefined}

        {showIntercomFeedback ? (
          <ContactItem
            screenReaderHidden={screenReaderHidden}
            body={t(ContactSheetTexts.customer_feedback.body)}
            buttonText={t(ContactSheetTexts.customer_feedback.button)}
            accessibilityHint={t(ContactSheetTexts.customer_feedback.a11yHint)}
            onPress={() => {
              unreadCount
                ? Intercom.displayMessenger()
                : Intercom.displayConversationsList();
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
          body={t(ContactSheetTexts.customer_service.body)}
          buttonText={t(ContactSheetTexts.customer_service.button)}
          focusRef={focusRef}
          accessibilityHint={t(ContactSheetTexts.customer_service.a11yHint)}
          buttonMode={'secondary'}
          icon={() => <ThemeIcon svg={ExternalLink} />}
          onPress={() => {
            Linking.openURL(customer_service_url);
            close();
          }}
        />
      </FullScreenFooter>
    </BottomSheetContainer>
  );
});

type ContactProps = {
  onPress: () => void;
  icon?: () => JSX.Element;
  body: string;
  buttonText: string;
  accessibilityHint: string;
  focusRef?: React.ForwardedRef<View>;
  screenReaderHidden?: AccessibilityProps;
  buttonMode?: ButtonProps['mode'];
};

const ContactItem: React.FC<ContactProps> = ({
  onPress,
  icon,
  body,
  buttonText,
  accessibilityHint,
  focusRef,
  screenReaderHidden,
  buttonMode = 'primary',
}) => {
  const styles = useStyles();

  return (
    <View style={styles.container} {...screenReaderHidden}>
      <View style={styles.descriptionSection} ref={focusRef} accessible>
        <ThemeText>{body}</ThemeText>
      </View>
      <Button
        mode={buttonMode}
        interactiveColor={
          buttonMode == 'primary' ? 'interactive_0' : 'interactive_2'
        }
        text={buttonText}
        accessibilityHint={accessibilityHint}
        onPress={onPress}
        rightIcon={icon && {svg: icon}}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    descriptionSection: {marginBottom: theme.spacings.medium},
    container: {
      marginBottom: theme.spacings.medium,
    },
  };
});
