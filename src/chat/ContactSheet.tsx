import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import {
  ScreenHeaderTexts,
  TravellersTexts,
  useTranslation,
} from '@atb/translations';
import React, {forwardRef} from 'react';
import {Linking, View} from 'react-native';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Support, Chat, ChatUnread} from '@atb/assets/svg/icons/actions';
import useChatUnreadCount from './use-chat-unread-count';
import Intercom from 'react-native-intercom';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

type Props = {
  close: () => void;
};

const ContactSheet = forwardRef<View, Props>(({close}, focusRef) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const unreadCount = useChatUnreadCount();
  const {customer_service_url} = useRemoteConfig();

  return (
    <BottomSheetContainer>
      <ScreenHeaderWithoutNavigation
        title={'Kontakt AtB'}
        rightButton={{
          type: 'skip',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.cancel.text),
        }}
        color={'background_2'}
        setFocusOnLoad={false}
      />

      <FullScreenFooter>
        <View style={styles.descriptionSection} ref={focusRef}>
          <ThemeText type="body__secondary" color="secondary">
            Spørsmål til kundeservice
          </ThemeText>
          <ThemeText>Har du spørsmål eller trenger hjelp?</ThemeText>
        </View>
        <Button
          color="primary_2"
          text="Kontakt kundeservice"
          accessibilityHint={t(TravellersTexts.primaryButton.a11yHint)}
          onPress={() => {
            if (Linking.canOpenURL(customer_service_url)) {
              Linking.openURL(customer_service_url);
            }
            close();
          }}
          iconPosition="right"
          icon={() => (
            <ThemeIcon colorType="background_gray" svg={Support}></ThemeIcon>
          )}
        />

        <View style={styles.descriptionSection}>
          <ThemeText type="body__secondary" color="secondary">
            Tilbakemelding på appen
          </ThemeText>
          <ThemeText>
            Vil du rapportere feil eller foreslå forbedringer?
          </ThemeText>
        </View>

        <Button
          color="primary_2"
          text="Gi tilbakemelding på app"
          accessibilityHint={t(TravellersTexts.primaryButton.a11yHint)}
          onPress={() => {
            unreadCount
              ? () => Intercom.displayMessenger()
              : Intercom.displayConversationsList();
            close();
          }}
          iconPosition="right"
          icon={() =>
            unreadCount ? (
              <ThemeIcon colorType="background_gray" svg={ChatUnread} />
            ) : (
              <ThemeIcon colorType="background_gray" svg={Chat} />
            )
          }
        />
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
