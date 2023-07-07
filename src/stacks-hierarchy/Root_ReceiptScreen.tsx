import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {Button} from '@atb/components/button';
import {MessageBox, MessageBoxProps} from '@atb/components/message-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {sendReceipt} from '@atb/ticketing';
import {
  FareContractTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {validateEmail} from '@atb/utils/validation';
import React, {useState} from 'react';
import {View} from 'react-native';
import {RootStackScreenProps} from '../stacks-hierarchy/navigation-types';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {useAnalytics} from '@atb/analytics';

type Props = RootStackScreenProps<'Root_ReceiptScreen'>;

type MessageState =
  | 'loading'
  | 'success'
  | 'error'
  | 'invalid-field'
  | undefined;

export function Root_ReceiptScreen({route}: Props) {
  const {orderId, orderVersion} = route.params;
  const styles = useStyles();
  const [email, setEmail] = useState('');
  const [reference, setReference] = useState<string | undefined>(undefined);
  const [state, setState] = useState<MessageState>(undefined);
  const {t} = useTranslation();
  const a11yContext = useAccessibilityContext();
  const analytics = useAnalytics();

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
        analytics.logEvent('Receipt', 'Email sent');
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
        title={t(FareContractTexts.receipt.header.title)}
        setFocusOnLoad={a11yContext.isScreenReaderEnabled}
      />
      <View style={styles.content}>
        <View accessibilityLiveRegion={'polite'}>
          <MessageBox
            {...translateStateToMessage(state, t, email, reference)}
          />
        </View>
        <Section withTopPadding withBottomPadding>
          <TextInputSectionItem
            label={t(FareContractTexts.receipt.inputLabel)}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            autoFocus={!a11yContext.isScreenReaderEnabled}
          />
        </Section>
        <Button
          text={t(FareContractTexts.receipt.sendButton)}
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
        message: t(FareContractTexts.receipt.messages.loading),
        type: 'info',
      };
    case 'error':
      return {
        message: t(FareContractTexts.receipt.messages.error),
        type: 'error',
      };
    case 'success':
      return {
        message: t(
          FareContractTexts.receipt.messages.success(email, reference!),
        ),
        type: 'valid',
      };
    case 'invalid-field':
      return {
        message: t(FareContractTexts.receipt.messages.invalidField),
        type: 'error',
      };
    default:
      return {
        message: t(FareContractTexts.receipt.messages.defaultFallback),
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
