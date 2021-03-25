import {enrollIntoBetaGroups} from '@atb/api/enrollment';
import {Confirm} from '@atb/assets/svg/icons/actions';
import Button from '@atb/components/button';
import {TextInput} from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import MessageBox from '@atb/components/message-box';
import {StyleSheet} from '@atb/theme';
import analytics from '@react-native-firebase/analytics';
import composeRefs from '@seznam/compose-react-refs';
import React, {forwardRef, useRef, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  onEnrolled(): void;
};

export default forwardRef<Modalize, Props>(function InviteModal(
  {onEnrolled},
  ref,
) {
  const styles = useStyles();
  const [inviteKey, setInviteKey] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {bottom: paddingBottom} = useSafeAreaInsets();
  const modalRef = useRef<Modalize>(null);
  const combinedRef = composeRefs<Modalize>(ref, modalRef);

  async function onTicketEnrollment() {
    setHasError(false);
    setIsLoading(true);
    try {
      const {data: enrollment} = await enrollIntoBetaGroups(inviteKey);
      if (enrollment && enrollment.status === 'ok') {
        await analytics().setUserProperty(
          'beta_group',
          enrollment.groups.join(','),
        );
        modalRef.current?.close();
        onEnrolled();
      }
    } catch (err) {
      console.warn(err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Portal>
      <Modalize
        ref={combinedRef}
        adjustToContentHeight={true}
        tapGestureEnabled={false}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'always',
        }}
      >
        <View style={[styles.container, {paddingBottom}]}>
          {isLoading ? (
            <ActivityIndicator style={styles.loading} />
          ) : (
            <>
              <ThemeText type="body__primary--bold" style={styles.title}>
                Registrer deg som testpilot for billettkjøp
              </ThemeText>
              <ThemeText type="body__primary" style={styles.text}>
                Send oss invitasjonskoden din og bli først ute med å teste
                billettkjøp direkte fra reiseappen.
              </ThemeText>
              <View style={styles.input}>
                <TextInput
                  radius="top-bottom"
                  label="Kode"
                  value={inviteKey}
                  onChangeText={setInviteKey}
                  autoCapitalize="none"
                />
              </View>
              {hasError && (
                <MessageBox
                  type="warning"
                  message="Du har sendt en ugyldig invitasjonskode. Prøv igjen, eller kontakt oss i appchat dersom den ikke fungerer."
                  containerStyle={styles.messageBox}
                />
              )}
            </>
          )}
          <Button
            onPress={onTicketEnrollment}
            text="Send inn kode"
            icon={Confirm}
            disabled={isLoading || !inviteKey}
            style={styles.button}
          />
        </View>
      </Modalize>
    </Portal>
  );
});

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors.background_3.backgroundColor,
    paddingVertical: theme.spacings.large,
    paddingHorizontal: theme.spacings.medium,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacings.medium,
  },
  text: {
    marginBottom: theme.spacings.medium,
  },
  input: {
    marginBottom: theme.spacings.medium,
  },
  messageBox: {
    marginBottom: theme.spacings.medium,
  },
  loading: {
    marginBottom: theme.spacings.medium,
  },
  button: {
    marginBottom: theme.spacings.small,
  },
}));

async function handleEnrollIntoGroup(inviteKey: string) {}
