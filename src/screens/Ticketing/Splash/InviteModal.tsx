import React, {forwardRef, useMemo, useRef, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import analytics from '@react-native-firebase/analytics';
import {enrollIntoBetaGroups} from '../../../api/enrollment';
import {useRemoteConfig} from '../../../RemoteConfigContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Button from '../../../components/button';
import {Confirm} from '../../../assets/svg/icons/actions';
import {StyleSheet} from '../../../theme';
import Input from '../../../components/input';
import MessageBox from '../../../message-box';

async function handleEnrollIntoGroup(inviteKey: string) {
  try {
    const {data: enrollment} = await enrollIntoBetaGroups(inviteKey);
    if (enrollment && enrollment.status === 'ok') {
      await analytics().setUserProperty(
        'beta_group',
        enrollment.groups.join(','),
      );
      return true;
    }
  } catch (err) {
    console.warn(err);
  } finally {
    return false;
  }
}

export default forwardRef<Modalize, unknown>(function InviteModal(_, ref) {
  const styles = useStyles();
  const {refresh} = useRemoteConfig();
  const [inviteKey, setInviteKey] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const {bottom: paddingBottom} = useSafeAreaInsets();

  async function onTicketEnrollment() {
    setHasError(false);
    const enrolled = await handleEnrollIntoGroup(inviteKey);
    if (enrolled) {
      refresh();
    } else setHasError(true);
  }

  return (
    <Portal>
      <Modalize
        ref={ref}
        adjustToContentHeight={true}
        tapGestureEnabled={false}
      >
        <View style={[styles.container, {paddingBottom}]}>
          <Text style={styles.title}>Lukket beta for billettkjøp</Text>
          <Text style={styles.text}>
            Her kan du sende inn invitasjonskode du har fått tilsendt fra AtB
            for å melde deg på beta for billettkjøp.
          </Text>
          <Input
            label="Kode"
            value={inviteKey}
            onChangeText={setInviteKey}
          ></Input>
          {hasError && (
            <MessageBox
              type="warning"
              message="Koden du prøvde å bruke er enten ugyldig eller utgått."
              containerStyle={styles.messageBox}
            />
          )}
          <Button
            onPress={onTicketEnrollment}
            text="Send inn kode"
            IconComponent={Confirm}
          />
        </View>
      </Modalize>
    </Portal>
  );
});

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingVertical: theme.spacings.large,
    paddingHorizontal: theme.spacings.medium,
  },
  title: {
    fontSize: theme.text.sizes.body,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacings.medium,
  },
  text: {
    fontSize: theme.text.sizes.body,
    marginBottom: theme.spacings.medium,
  },
  messageBox: {
    marginBottom: theme.spacings.medium,
  },
}));
