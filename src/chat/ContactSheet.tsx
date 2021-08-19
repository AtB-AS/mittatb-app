import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import {
  ScreenHeaderTexts,
  ContactSheetTexts,
  useTranslation,
} from '@atb/translations';
import React, {forwardRef} from 'react';
import {Linking, View} from 'react-native';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Support, ChatUnread} from '@atb/assets/svg/icons/actions';
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
  const {customer_service_url, enable_intercom} = useRemoteConfig();

  return (
    <BottomSheetContainer>
      <View ref={focusRef}>
        <ScreenHeaderWithoutNavigation
          title={t(ContactSheetTexts.header.title)}
          leftButton={{
            type: 'cancel',
            onPress: close,
            text: t(ScreenHeaderTexts.headerButton.cancel.text),
          }}
          color={'background_2'}
          setFocusOnLoad={false}
        />
      </View>

      <FullScreenFooter>
        <View style={styles.descriptionSection}>
          <ThemeText type="body__secondary" color="secondary">
            {t(ContactSheetTexts.customer_service.title)}
          </ThemeText>
          <ThemeText>{t(ContactSheetTexts.customer_service.body)}</ThemeText>
        </View>
        <Button
          color="primary_2"
          text={t(ContactSheetTexts.customer_service.button)}
          accessibilityHint={t(ContactSheetTexts.customer_service.a11yHint)}
          onPress={() => {
            Linking.openURL(customer_service_url);
            close();
          }}
          iconPosition="right"
          icon={() => (
            <ThemeIcon colorType="primary_2" svg={Support}></ThemeIcon>
          )}
        />

        {enable_intercom ? (
          <View {...screenReaderHidden}>
            <View style={styles.descriptionSection}>
              <ThemeText type="body__secondary" color="secondary">
                {t(ContactSheetTexts.intercom.title)}
              </ThemeText>
              <ThemeText>{t(ContactSheetTexts.intercom.body)}</ThemeText>
            </View>

            <Button
              color="primary_2"
              text={t(ContactSheetTexts.intercom.button)}
              accessibilityHint={t(ContactSheetTexts.intercom.a11yHint)}
              onPress={() => {
                unreadCount
                  ? Intercom.displayMessenger()
                  : Intercom.displayConversationsList();
                close();
              }}
              iconPosition="right"
              icon={() =>
                unreadCount ? (
                  <ThemeIcon colorType="primary_2" svg={ChatUnread} />
                ) : (
                  <></>
                )
              }
            />
          </View>
        ) : undefined}
      </FullScreenFooter>
    </BottomSheetContainer>
  );
});

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
