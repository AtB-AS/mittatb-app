import React, {useState} from 'react';
import {View, TouchableOpacity, Modal, TextInput, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp} from '@react-navigation/native';
import {sendReceipt} from '../../../../api/fareContracts';
import {StyleSheet} from '../../../../theme';
import Text from '../../../../components/text';
import * as Sections from '../../../../components/sections';
import Header from '../../../../ScreenHeader';
import {TicketModalNavigationProp, TicketModalStackParams} from './';
import ThemeIcon from '../../../../components/theme-icon';
import {ArrowLeft} from '../../../../assets/svg/icons/navigation';
import MessageBox, {MessageBoxProps} from '../../../../message-box';
import Button from '../../../../components/button';

export type ReceiptScreenRouteParams = {
  orderId: string;
  orderVersion: string;
};

export type TicketDetailsScreenRouteProp = RouteProp<
  TicketModalStackParams,
  'TicketReceipt'
>;

type Props = {
  route: TicketDetailsScreenRouteProp;
  navigation: TicketModalNavigationProp;
};

type MessageState = 'loading' | 'success' | 'error' | undefined;

export default function ReceiptScreen({navigation, route}: Props) {
  const {orderId, orderVersion} = route.params;
  const styles = useStyles();
  const [email, setEmail] = useState('');
  const [reference, setReference] = useState<string | undefined>(undefined);
  const [state, setState] = useState<MessageState>(undefined);

  async function onSend() {
    if (email.trim().length) {
      try {
        setState('loading');
        setReference(undefined);
        const response = await sendReceipt(
          orderId,
          parseInt(orderVersion, 10),
          email,
        );

        if (!response.reference) throw new Error('No response reference');

        setReference(response.reference);
        setState('success');
      } catch (err) {
        console.warn(err);
        setState('error');
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftButton={{
          onPress: () => navigation.goBack(),
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: 'Gå tilbake',
          icon: <ThemeIcon svg={ArrowLeft} />,
        }}
        title="Send kvittering"
        style={styles.header}
      />
      <View style={styles.content}>
        <MessageBox {...translateStateToMessage(state, email, reference)} />
        <Sections.Section withTopPadding withBottomPadding>
          <Sections.TextInput
            label="E-post"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCompleteType="email"
            autoCorrect={false}
            autoFocus={true}
          />
        </Sections.Section>
        <Button text="Send" onPress={onSend} disabled={state === 'loading'} />
      </View>
    </SafeAreaView>
  );
}

function translateStateToMessage(
  state: MessageState,
  email: string,
  reference?: string,
): Required<Pick<MessageBoxProps, 'type' | 'message'>> {
  switch (state) {
    case 'loading':
      return {
        message: 'Sender kvittering...',
        type: 'info',
      };
    case 'error':
      return {
        message:
          'Oops! Noe feilet under sending av kvittering, kan du prøve igjen? 🤞',
        type: 'error',
      };
    case 'success':
      return {
        message: `Din kvittering ble sendt til ${email} med referansen: ${reference}.`,
        type: 'success',
      };
    default:
      return {
        message: `Du kan få tilsendt kvittering på e-post. Fyll inn din e-postadresse under, og trykk "Send".`,
        type: 'info',
      };
  }
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    backgroundColor: theme.background.level2,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background.level2,
  },
  content: {
    padding: theme.spacings.medium,
  },
}));
