import React, {useCallback, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {EnrollmentTexts, useTranslation} from '@atb/translations';
import {
  MessageInfoBox,
  MessageInfoBoxProps,
} from '@atb/components/message-info-box';
import {TextInputSectionItem} from '@atb/components/sections';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {enrollIntoBetaGroups} from '@atb/api/enrollment';
import analytics from '@react-native-firebase/analytics';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';

export const Profile_EnrollmentScreen = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[0];
  const [inviteCode, setInviteCode] = useState<string>('');

  const {onEnroll, hasError, isLoading, isEnrolled} = useEnroll();

  const messageType: MessageInfoBoxProps['type'] = isEnrolled
    ? 'valid'
    : hasError
    ? 'warning'
    : 'info';
  const messageText = useMessageText(messageType);

  return (
    <FullScreenView
      headerProps={{
        title: t(EnrollmentTexts.header),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading ref={focusRef} text={t(EnrollmentTexts.header)} />
      )}
    >
      <View style={styles.contentContainer}>
        <MessageInfoBox type={messageType} message={messageText} />
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
              expanded={true}
              onPress={() => onEnroll(inviteCode)}
              text={t(EnrollmentTexts.button)}
              leftIcon={{svg: Confirm}}
              disabled={isLoading || !inviteCode}
              interactiveColor={interactiveColor}
            />
          </>
        )}
      </View>
    </FullScreenView>
  );
};

type UserProperties = {[key: string]: string | null};

const useEnroll = () => {
  const {refresh} = useRemoteConfigContext();

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
    [setHasError, setIsLoading, setIsEnrolled, refresh],
  );

  return {
    hasError,
    isLoading,
    isEnrolled,
    onEnroll,
  };
};

function useMessageText(type: MessageInfoBoxProps['type']) {
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
  contentContainer: {
    padding: theme.spacing.medium,
    rowGap: theme.spacing.medium,
  },
}));
