import React, {useCallback, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Button} from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {EnrollmentTexts, useTranslation} from '@atb/translations';
import {MessageBox, MessageBoxProps} from '@atb/components/message-box';
import {TextInputSectionItem} from '@atb/components/sections';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {enrollIntoBetaGroups} from '@atb/api/enrollment';
import analytics from '@react-native-firebase/analytics';

export const Profile_EnrollmentScreen = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [inviteCode, setInviteCode] = useState<string>('');

  const {onEnroll, hasError, isLoading, isEnrolled} = useEnroll();

  const messageType: MessageBoxProps['type'] = isEnrolled
    ? 'valid'
    : hasError
    ? 'warning'
    : 'info';
  const messageText = useMessageText(messageType);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(EnrollmentTexts.header)}
        leftButton={{type: 'back'}}
      />
      <View style={styles.contentContainer}>
        <View style={styles.spacing}>
          <MessageBox type={messageType} message={messageText} />
        </View>
        {isEnrolled ? null : isLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <TextInputSectionItem
              radius="top-bottom"
              label={t(EnrollmentTexts.label)}
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="none"
            />
            <Button
              onPress={() => onEnroll(inviteCode)}
              text={t(EnrollmentTexts.button)}
              leftIcon={{svg: Confirm}}
              disabled={isLoading || !inviteCode}
              style={styles.button}
              interactiveColor="interactive_0"
            />
          </>
        )}
      </View>
    </View>
  );
};

type UserProperties = {[key: string]: string | null};

const useEnroll = () => {
  const {refresh} = useRemoteConfig();

  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const onEnroll = useCallback(
    async function onEnroll(key: string) {
      setHasError(false);
      setIsLoading(true);
      try {
        const {data: enrollment} = await enrollIntoBetaGroups(key);
        if (enrollment && enrollment.status === 'ok') {
          const userProperties = enrollment.groups.reduce<UserProperties>(
            (acc, group) => ({...acc, [group]: 'true'}),
            {},
          );
          await analytics().setUserProperties(userProperties);
          refresh();
          setIsEnrolled(true);
        }
      } catch (err) {
        console.warn(err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [setHasError, setIsLoading, setIsEnrolled],
  );

  return {
    hasError,
    isLoading,
    isEnrolled,
    onEnroll,
  };
};

function useMessageText(type: MessageBoxProps['type']) {
  const {t} = useTranslation();
  switch (type) {
    case 'valid':
      return t(EnrollmentTexts.success);
    case 'warning':
      return t(EnrollmentTexts.warning);
    case 'info':
    default:
      return t(EnrollmentTexts.info);
  }
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacings.medium,
    flex: 1,
  },
  input: {
    marginTop: theme.spacings.medium,
  },
  button: {marginVertical: theme.spacings.medium},
  spacing: {
    marginBottom: theme.spacings.medium,
  },
}));
