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
import {
  useFirestoreConfigurationContext,
  type RefundReasonType,
} from '@atb/modules/configuration';
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
  const [missingReason, setMissingReason] = useState(false);

  const {status: refundOptionsStatus} = useRefundOptionsQuery(orderId, state);

  const {mutate: refund, status: refundStatus} =
    useRefundFareContractMutation();

  const {refundReasons} = useFirestoreConfigurationContext();

  const [selectedReason, setSelectedReason] = useState<RefundReasonType>();

  const onRefund = () => {
    if (refundReasons?.length && !selectedReason) {
      setMissingReason(true);
      return;
    }
    refund(
      {orderId, reasonId: selectedReason?.id},
      {
        onSuccess: () => {
          logEvent('Ticketing', 'Ticket refunded', {
            fareProductType,
            refundReasonId: selectedReason?.id,
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
            <View style={styles.descriptionRow}>
              <ThemedBeacons height={54} width={54} />
              <ThemeText style={styles.descriptionText}>
                {t(FareContractTexts.refund.description)}
              </ThemeText>
            </View>
          </GenericSectionItem>
        </Section>
        {!!refundReasons?.length && (
          <>
            <ContentHeading
              text={t(FareContractTexts.refund.refundReasonTitle)}
            />
            <RadioGroupSection<RefundReasonType>
              items={refundReasons}
              selected={selectedReason}
              keyExtractor={(reason) => reason.id}
              itemToText={(reason) =>
                getTextForLanguage(reason.name, language) ?? reason.id
              }
              onSelect={(reason) => {
                setMissingReason(false);
                setSelectedReason(reason);
              }}
            />
          </>
        )}
        {missingReason && (
          <MessageInfoBox
            message={t(FareContractTexts.refund.missingReasonError)}
            type="error"
            hideDebugInfo={true}
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

const useStyles = StyleSheet.createThemeHook((theme, {bottom}) => ({
  content: {
    padding: theme.spacing.medium,
    paddingBottom: bottom + theme.spacing.medium,
    gap: theme.spacing.medium,
  },
  descriptionRow: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
  },
  descriptionText: {
    flex: 1,
  },
}));
