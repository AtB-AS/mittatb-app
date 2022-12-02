import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import {
  ContactSheetTexts,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import React, {forwardRef} from 'react';
import {AccessibilityProps, Linking, View} from 'react-native';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ChatUnread} from '@atb/assets/svg/color/icons/actions';
import useChatUnreadCount from './use-chat-unread-count';
import Intercom from 'react-native-intercom';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {screenReaderHidden} from '@atb/utils/accessibility';

type Props = {
  close: () => void;
};

const ContactSheet = forwardRef<View, Props>(({close}, focusRef) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const unreadCount = useChatUnreadCount();
  const {customer_service_url, enable_intercom, customer_feedback_url} =
    useRemoteConfig();

  const showWebsiteFeedback = !!customer_feedback_url;
  const showIntercomFeedback = enable_intercom && !showWebsiteFeedback;

  return (
    <BottomSheetContainer>
      <View>
        <ScreenHeaderWithoutNavigation
          title={t(ContactSheetTexts.header.title)}
          leftButton={{
            type: 'cancel',
            onPress: close,
            text: t(ScreenHeaderTexts.headerButton.cancel.text),
          }}
          color={'background_1'}
          setFocusOnLoad={false}
        />
      </View>
      <FullScreenFooter>
        <ContactItem
          title={t(ContactSheetTexts.customer_service.title)}
          body={t(ContactSheetTexts.customer_service.body)}
          buttonText={t(ContactSheetTexts.customer_service.button)}
          focusRef={focusRef}
          accessibilityHint={t(ContactSheetTexts.customer_service.a11yHint)}
          onPress={() => {
            Linking.openURL(customer_service_url);
            close();
          }}
        />

        {showWebsiteFeedback ? (
          <ContactItem
            title={t(ContactSheetTexts.customer_feedback_website.title)}
            body={t(ContactSheetTexts.customer_feedback_website.body)}
            buttonText={t(ContactSheetTexts.customer_feedback_website.button)}
            accessibilityHint={t(
              ContactSheetTexts.customer_feedback_website.a11yHint,
            )}
            onPress={() => {
              Linking.openURL(customer_feedback_url);
              close();
            }}
          />
        ) : undefined}

        {showIntercomFeedback ? (
          <ContactItem
            screenReaderHidden={screenReaderHidden}
            title={t(ContactSheetTexts.customer_feedback.title)}
            body={t(ContactSheetTexts.customer_feedback.body)}
            buttonText={t(ContactSheetTexts.customer_feedback.button)}
            accessibilityHint={t(ContactSheetTexts.customer_feedback.a11yHint)}
            onPress={() => {
              unreadCount
                ? Intercom.displayMessenger()
                : Intercom.displayConversationsList();
              close();
            }}
            icon={() =>
              unreadCount ? (
                <ThemeIcon colorType="background_accent_3" svg={ChatUnread} />
              ) : (
                <></>
              )
            }
          />
        ) : undefined}
      </FullScreenFooter>
    </BottomSheetContainer>
  );
});

type ContactProps = {
  onPress: () => void;
  icon?: () => JSX.Element;
  title: string;
  body: string;
  buttonText: string;
  accessibilityHint: string;
  focusRef?: React.ForwardedRef<View>;
  screenReaderHidden?: AccessibilityProps;
};

const ContactItem: React.FC<ContactProps> = ({
  onPress,
  icon,
  title,
  body,
  buttonText,
  accessibilityHint,
  focusRef,
  screenReaderHidden,
}) => {
  const styles = useStyles();

  return (
    <View {...screenReaderHidden}>
      <View style={styles.descriptionSection} ref={focusRef} accessible>
        <ThemeText type="body__secondary" color="secondary">
          {title}
        </ThemeText>
        <ThemeText>{body}</ThemeText>
      </View>
      <Button
        interactiveColor="interactive_0"
        text={buttonText}
        accessibilityHint={accessibilityHint}
        onPress={onPress}
        rightIcon={icon}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    descriptionSection: {
      margin: theme.spacings.medium,
      marginBottom: theme.spacings.large,
      marginTop: theme.spacings.xLarge,
    },
  };
});

export default ContactSheet;
