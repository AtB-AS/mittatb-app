import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import Button from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {EnrollmentTexts, useTranslation} from '@atb/translations';
import MessageBox, {MessageType} from '@atb/components/message-box';
import useEnroll from './use-enroll';
import TextInput from '@atb/components/sections/text-input';
import {Confirm} from '@atb/assets/svg/icons/actions';
import FullScreenHeader from '@atb/components/screen-header/full-header';

export default function Splash() {
  const styles = useStyles();
  const {t} = useTranslation();
  const [inviteCode, setInviteCode] = useState<string>('');

  const {onEnroll, hasError, isLoading, isEnrolled} = useEnroll();

  const messageType: MessageType = isEnrolled
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
            <TextInput
              radius="top-bottom"
              label={t(EnrollmentTexts.label)}
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="none"
            />
            <Button
              onPress={() => onEnroll(inviteCode)}
              text={t(EnrollmentTexts.button)}
              icon={Confirm}
              disabled={isLoading || !inviteCode}
              style={styles.button}
              color={'primary_2'}
            />
          </>
        )}
      </View>
    </View>
  );
}

function useMessageText(type: MessageType) {
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
    backgroundColor: theme.colors.background_1.backgroundColor,
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
