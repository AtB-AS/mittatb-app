import {useAnalyticsContext} from '@atb/analytics';
import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useRefundFareContractMutation} from '@atb/ticketing/use-refund-mutation';
import {useRefundOptionsQuery} from '@atb/ticketing/use-refund-options-query';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React, {useEffect} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  orderId: string;
  fareProductType: string | undefined;
};

export const RefundBottomSheet = ({orderId, fareProductType}: Props) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const {close} = useBottomSheetContext();
  const analytics = useAnalyticsContext();
  const {data: refundOptions, status: refundOptionsStatus} =
    useRefundOptionsQuery(orderId);

  const {mutate: refund, status: refundStatus} =
    useRefundFareContractMutation();

  useEffect(() => {
    if (refundStatus === 'success') {
      analytics.logEvent('Ticketing', 'Ticket refunded', {
        fareProductType,
      });
      close();
    }
  }, [refundStatus, analytics, close]);

  return (
    <BottomSheetContainer
      title={t(FareContractTexts.refund.bottomSheetTitle)}
      focusTitleOnLoad={true}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {refundOptions?.is_refundable === false && (
          <MessageInfoBox
            message={t(FareContractTexts.refund.notRefundable)}
            type="error"
          />
        )}
        <Section>
          <GenericSectionItem type="spacious">
            <ThemeText>
              {t(FareContractTexts.refund.bottomSheetDescription)}
            </ThemeText>
          </GenericSectionItem>
        </Section>
        {refundStatus === 'error' && (
          <MessageInfoBox
            message={t(FareContractTexts.refund.genericError)}
            type="error"
          />
        )}
        {refundOptionsStatus === 'error' && (
          <MessageInfoBox
            type="error"
            message={t(FareContractTexts.refund.genericRefundOptionsError)}
          />
        )}
        <Button
          expanded={true}
          onPress={() => refund(orderId)}
          text={t(FareContractTexts.refund.confirm)}
          disabled={!refundOptions?.is_refundable}
          loading={
            refundStatus === 'loading' || refundOptionsStatus === 'loading'
          }
          interactiveColor={theme.color.interactive.destructive}
        />
        <Button
          backgroundColor={theme.color.background.neutral[1]}
          onPress={() => {
            close();
          }}
          text={t(FareContractTexts.refund.cancel)}
          mode="secondary"
          expanded={true}
        />
      </ScrollView>
    </BottomSheetContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    container: {
      backgroundColor: theme.color.background.neutral[1].background,
      marginHorizontal: theme.spacing.medium,
      marginBottom: Math.max(bottom, theme.spacing.medium),
    },
    contentContainer: {
      rowGap: theme.spacing.medium,
    },
  };
});
