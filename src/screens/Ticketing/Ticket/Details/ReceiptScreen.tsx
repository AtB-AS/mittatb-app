import Button from '@atb/components/button';
import * as Sections from '@atb/components/sections';
import MessageBox, {MessageBoxProps} from '@atb/components/message-box';
import {StyleSheet} from '@atb/theme';
import {sendReceipt} from '@atb/tickets';
import {
  TicketTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {View} from 'react-native';
import {TicketModalNavigationProp, TicketModalStackParams} from './';
import FullScreenHeader from '@atb/components/screen-header/full-header';

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
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'back'}}
        title={t(TicketTexts.receipt.header.title)}
      />
      <View style={styles.content}>
        <MessageBox {...translateStateToMessage(state, t, email, reference)} />
        <Sections.Section withTopPadding withBottomPadding>
          <Sections.TextInput
            label={t(TicketTexts.receipt.inputLabel)}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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
          color="primary_2"
        />
      </View>
    </View>
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
        type: 'valid',
      };
    default:
      return {
        message: t(TicketTexts.receipt.messages.defaultFallback),
        type: 'info',
      };
  }
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_2.backgroundColor,
  },
  content: {
    padding: theme.spacings.medium,
  },
}));
