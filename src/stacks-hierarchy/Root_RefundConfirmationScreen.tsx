import {Button} from '@atb/components/button';
import {ContentHeading} from '@atb/components/heading';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenView} from '@atb/components/screen-view';
import {
  GenericSectionItem,
  RadioGroupSection,
  Section,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  useRefundFareContractMutation,
  useRefundOptionsQuery,
} from '@atb/modules/ticketing';
import type {RefundCause} from '@atb/modules/ticketing';
import {
  FareContractTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import React, {useState} from 'react';
import {View} from 'react-native';
import {RootStackScreenProps} from './navigation-types';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {CUSTOMER_SERVICE_URL} from '@env';
import {ThemedBeacons} from '@atb/theme/ThemedAssets';

type Props = RootStackScreenProps<'Root_RefundConfirmationScreen'>;

export function Root_RefundConfirmationScreen({navigation, route}: Props) {
  const {orderId, fareProductType, state} = route.params;
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t, language} = useTranslation();
  const {logEvent} = useAnalyticsContext();
  const focusRef = useFocusOnLoad(navigation);
  const [missingCause, setMissingCause] = useState(false);

  const {data: refundOptions, status: refundOptionsStatus} =
    useRefundOptionsQuery(orderId, state);

  const {mutate: refund, status: refundStatus} =
    useRefundFareContractMutation();

  const [selectedCause, setSelectedCause] = useState<RefundCause | undefined>(
    undefined,
  );

  const causes = refundOptions?.causes;

  const onRefund = () => {
    if (causes?.length && !selectedCause) {
      setMissingCause(true);
      return;
    }
    refund(
      {orderId, causeId: selectedCause?.id},
      {
        onSuccess: () => {
          logEvent('Ticketing', 'Ticket refunded', {
            fareProductType,
            refundCauseId: selectedCause?.id,
          });
          navigation.goBack();
        },
      },
    );
  };

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(FareContractTexts.refund.refund),
        leftButton: {type: 'back'},
      }}
    >
      <View style={styles.content}>
        <Section>
          <GenericSectionItem type="spacious">
            <View style={{flexDirection: 'row', gap: theme.spacing.medium}}>
              <ThemedBeacons height={54} width={54} />
              <ThemeText style={{flex: 1}}>
                {t(FareContractTexts.refund.description)}
              </ThemeText>
            </View>
          </GenericSectionItem>
        </Section>
        <ContentHeading text={t(FareContractTexts.refund.refundReasonTitle)} />
        {!!causes?.length && (
          <RadioGroupSection<RefundCause>
            items={causes}
            selected={selectedCause}
            keyExtractor={(cause) => cause.id}
            itemToText={(cause) =>
              getTextForLanguage(cause.name, language) ?? cause.id
            }
            onSelect={(cause) => {
              setMissingCause(false);
              setSelectedCause(cause);
            }}
          />
        )}
        {missingCause && (
          <MessageInfoBox
            message={t(FareContractTexts.refund.missingCauseError)}
            type="error"
          />
        )}
        {refundStatus === 'error' && (
          <MessageInfoBox
            message={t(FareContractTexts.refund.genericError)}
            type="error"
            onPressConfig={{
              text: t(FareContractTexts.refund.genericErrorLink),
              url: CUSTOMER_SERVICE_URL,
            }}
          />
        )}
        <Button
          expanded={true}
          onPress={onRefund}
          text={t(FareContractTexts.refund.confirm)}
          loading={
            refundStatus === 'pending' || refundOptionsStatus === 'pending'
          }
          interactiveColor={theme.color.interactive.destructive}
        />
      </View>
    </FullScreenView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  content: {
    padding: theme.spacing.medium,
    gap: theme.spacing.medium,
  },
}));
