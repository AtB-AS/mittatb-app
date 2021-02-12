import {sendReceipt} from '@atb/api/fareContracts';
import Button from '@atb/components/button';
import Header from '@atb/components/screen-header';
import * as Sections from '@atb/components/sections';
import MessageBox, {MessageBoxProps} from '@atb/message-box';
import {StyleSheet} from '@atb/theme';
import {
  TicketTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TicketModalNavigationProp, TicketModalStackParams} from './';

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
  const {t} = useTranslation();

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
        leftButton={{type: 'back'}}
        title={t(TicketTexts.receipt.header.title)}
        style={styles.header}
      />
      <View style={styles.content}>
        <MessageBox {...translateStateToMessage(state, t, email, reference)} />
        <Sections.Section withTopPadding withBottomPadding>
          <Sections.TextInput
            label={t(TicketTexts.receipt.inputLabel)}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCompleteType="email"
            autoCorrect={false}
            autoFocus={true}
          />
        </Sections.Section>
        <Button
          text={t(TicketTexts.receipt.sendButton)}
          onPress={onSend}
          disabled={state === 'loading'}
        />
      </View>
    </SafeAreaView>
  );
}

function translateStateToMessage(
  state: MessageState,
  t: TranslateFunction,
  email: string,
  reference?: string,
): Required<Pick<MessageBoxProps, 'type' | 'message'>> {
  switch (state) {
    case 'loading':
      return {
        message: t(TicketTexts.receipt.messages.loading),
        type: 'info',
      };
    case 'error':
      return {
        message: t(TicketTexts.receipt.messages.error),
        type: 'error',
      };
    case 'success':
      return {
        message: t(TicketTexts.receipt.messages.success(email, reference!)),
        type: 'success',
      };
    default:
      return {
        message: t(TicketTexts.receipt.messages.defaultFallback),
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
