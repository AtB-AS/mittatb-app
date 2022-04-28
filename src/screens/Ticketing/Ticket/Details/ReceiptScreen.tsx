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
import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {validateEmail} from '@atb/utils/validation';

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

type MessageState =
  | 'loading'
  | 'success'
  | 'error'
  | 'invalid-field'
  | undefined;

export default function ReceiptScreen({navigation, route}: Props) {
  const {orderId, orderVersion} = route.params;
  const styles = useStyles();
  const [email, setEmail] = useState('');
  const [reference, setReference] = useState<string | undefined>(undefined);
  const [state, setState] = useState<MessageState>(undefined);
  const {t} = useTranslation();
  const a11yContext = useAccessibilityContext();

  async function onSend() {
    if (validateEmail(email.trim())) {
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
    } else {
      setState('invalid-field');
    }
  }

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'back'}}
        title={t(TicketTexts.receipt.header.title)}
        setFocusOnLoad={a11yContext.isScreenReaderEnabled}
      />
      <View style={styles.content}>
        <View accessibilityLiveRegion={'polite'}>
          <MessageBox
            {...translateStateToMessage(state, t, email, reference)}
          />
        </View>
        <Sections.Section withTopPadding withBottomPadding>
          <Sections.TextInput
            label={t(TicketTexts.receipt.inputLabel)}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            autoFocus={!a11yContext.isScreenReaderEnabled}
          />
        </Sections.Section>
        <Button
          text={t(TicketTexts.receipt.sendButton)}
          onPress={onSend}
          disabled={state === 'loading'}
          interactiveColor="interactive_0"
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
    case 'invalid-field':
      return {
        message: t(TicketTexts.receipt.messages.invalidField),
        type: 'error',
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
    backgroundColor: theme.static.background.background_2.background,
  },
  content: {
    padding: theme.spacings.medium,
  },
}));
