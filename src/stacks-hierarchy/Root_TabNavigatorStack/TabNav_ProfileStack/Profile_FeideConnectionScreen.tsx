import React, {useEffect, useState} from 'react';
import {Linking, View} from 'react-native';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {StyleSheet, Theme} from '@atb/theme';
import {
  dictionary,
  FeideConnectionTexts,
  useTranslation,
} from '@atb/translations';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';
import {FEIDE_CALLBACK_URL} from '@atb/api/identity';
import {closeInAppBrowseriOS} from '@atb/modules/in-app-browser';
import {storage} from '@atb/modules/storage';
import {
  useConnectFeideMutation,
  useInitFeideConnectMutation,
} from '@atb/modules/feide';
import {ProfileScreenProps} from './navigation-types';

type Props = ProfileScreenProps<'Profile_FeideConnectionScreen'>;

export const Profile_FeideConnectionScreen = ({navigation}: Props) => {
  const style = useStyle();
  const {t} = useTranslation();
  const appStatus = useAppStateStatus();
  const focusRef = useFocusOnLoad(navigation);

  const [localError, setLocalError] = useState(false);

  const {mutateAsync: initFeideConnect, isPending: isInitting} =
    useInitFeideConnectMutation();

  const {
    mutate: connectFeide,
    isPending: isConnecting,
    isSuccess,
    data,
    error: connectError,
  } = useConnectFeideMutation();

  const hasError = localError || !!connectError;

  useEffect(() => {
    const handleUrl = async ({url}: {url: string}) => {
      if (url.includes(FEIDE_CALLBACK_URL)) {
        closeInAppBrowseriOS();
        const parsed = new URL(url);
        const code = parsed.searchParams.get('code');
        const state = parsed.searchParams.get('state');
        const initialState = await storage.get('feide_state');

        if (code && state && state === initialState) {
          setLocalError(false);
          connectFeide(code);
          await storage.set('feide_state', '');
          await storage.set('feide_nonce', '');
        } else if (parsed.searchParams.get('error')) {
          setLocalError(true);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleUrl);
    return () => subscription.remove();
  }, [appStatus, connectFeide]);

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(FeideConnectionTexts.header.title),
        leftButton: {type: 'back'},
      }}
      headerContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(FeideConnectionTexts.header.title)}
        />
      )}
    >
      <View style={style.container}>
        <ThemeText>{t(FeideConnectionTexts.description)}</ThemeText>

        {isSuccess && (
          <MessageInfoBox
            type="valid"
            title={t(FeideConnectionTexts.success.title)}
            message={
              data?.name
                ? t(FeideConnectionTexts.success.message(data.name))
                : t(FeideConnectionTexts.success.messageNoName)
            }
          />
        )}

        {hasError && (
          <MessageInfoBox
            type="error"
            message={
              connectError
                ? t(dictionary.genericErrorMsg)
                : t(FeideConnectionTexts.error)
            }
          />
        )}

        <Button
          onPress={() => {
            setLocalError(false);
            initFeideConnect();
          }}
          text={t(FeideConnectionTexts.connectButton)}
          expanded={true}
          loading={isInitting || isConnecting}
          disabled={isInitting || isConnecting}
          testID="connectFeideButton"
        />
      </View>
    </FullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    margin: theme.spacing.medium,
    rowGap: theme.spacing.medium,
  },
}));
