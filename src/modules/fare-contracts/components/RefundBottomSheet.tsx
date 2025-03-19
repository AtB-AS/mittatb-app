import {useAnalyticsContext} from '@atb/analytics';
import {getAxiosErrorMetadata} from '@atb/api/utils';
import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {refundFareContract} from '@atb/ticketing';
import {useRefundOptionsQuery} from '@atb/ticketing/use-refund-options-query';
import {FareContractTexts, useTranslation} from '@atb/translations';
import Bugsnag from '@bugsnag/react-native';
import React, {useState} from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const {close} = useBottomSheetContext();
  const analytics = useAnalyticsContext();
  const {data: refundOptions, status: refundOptionsStatus} =
    useRefundOptionsQuery(orderId);

  const onRefund = async () => {
    setIsLoading(true);
    try {
      await refundFareContract(orderId);
      analytics.logEvent('Ticketing', 'Ticket refunded', {
        fareProductType,
      });
      close();
    } catch (e: any) {
      const errorData = getAxiosErrorMetadata(e);
      Bugsnag.notify({
        name: `${errorData.responseStatus} error when refunding fare contract`,
        message: `Error: ${JSON.stringify(errorData)}`,
      });
      setError(true);
    }
    setIsLoading(false);
  };

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
        {error && (
          <MessageInfoBox
            message={t(FareContractTexts.refund.genericError)}
            type="error"
          />
        )}
        <Button
          expanded={true}
          onPress={onRefund}
          text={t(FareContractTexts.refund.confirm)}
          disabled={
            refundOptionsStatus !== 'success' || !refundOptions?.is_refundable
          }
          loading={isLoading || refundOptionsStatus === 'loading'}
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
