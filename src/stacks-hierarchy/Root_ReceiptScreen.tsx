import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {Button} from '@atb/components/button';
import {
  MessageInfoBox,
  MessageInfoBoxProps,
} from '@atb/components/message-info-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {sendReceipt} from '@atb/ticketing';
import {
  FareContractTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {isValidEmail} from '@atb/utils/validation';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {RootStackScreenProps} from '../stacks-hierarchy/navigation-types';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {useAnalyticsContext} from '@atb/analytics';
import {useProfileQuery} from '@atb/queries';

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
  const {data: customerProfile, status: profileStatus} = useProfileQuery();
  const [email, setEmail] = useState('');
  const [reference, setReference] = useState<string | undefined>(undefined);
  const [state, setState] = useState<MessageState>(undefined);
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const a11yContext = useAccessibilityContext();
  const analytics = useAnalyticsContext();

  useEffect(() => {
    if (profileStatus === 'success') {
      setEmail(customerProfile.email);
    }
  }, [customerProfile, profileStatus]);

  async function onSend() {
    if (isValidEmail(email.trim())) {
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

  // resets the state when there are changes to email input field
  function onTextChanged(text: string) {
    // do not do anything when the state is loading, otherwise it will cause unwanted issues
    if (state !== 'loading') {
      setState(undefined);
      setEmail(text);
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
        <View accessibilityLiveRegion="polite">
          <MessageInfoBox
            {...translateStateToMessage(state, t, email, reference)}
          />
        </View>
        <Section style={styles.section}>
          {profileStatus === 'loading' ? (
            <ActivityIndicator />
          ) : (
            <TextInputSectionItem
              label={t(FareContractTexts.receipt.inputLabel)}
              value={email}
              onChangeText={onTextChanged}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              autoFocus={!a11yContext.isScreenReaderEnabled}
            />
          )}
        </Section>
        <Button
          expanded={true}
          text={t(FareContractTexts.receipt.sendButton)}
          onPress={onSend}
          disabled={state === 'loading'}
          interactiveColor={theme.color.interactive[0]}
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
): Required<Pick<MessageInfoBoxProps, 'type' | 'message'>> {
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
    backgroundColor: theme.color.background.neutral[2].background,
  },
  content: {
    padding: theme.spacing.medium,
  },
  section: {
    marginTop: theme.spacing.large,
    marginBottom: theme.spacing.large,
  },
}));
