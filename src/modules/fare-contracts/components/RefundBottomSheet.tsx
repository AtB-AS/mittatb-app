import {useAnalyticsContext} from '@atb/analytics';
import SvgExternalLink from '@atb/assets/svg/mono-icons/navigation/ExternalLink';
import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useRefundFareContractMutation} from '@atb/ticketing/use-refund-mutation';
import {useRefundOptionsQuery} from '@atb/ticketing/use-refund-options-query';
import {
  FareContractTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import React, {useEffect} from 'react';
import {Linking} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  orderId: string;
  fareProductType: string | undefined;
};

export const RefundBottomSheet = ({orderId, fareProductType}: Props) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t, language} = useTranslation();
  const {configurableLinks} = useFirestoreConfigurationContext();
  const refundInfoUrl = getTextForLanguage(
    configurableLinks?.refundInfo,
    language,
  );
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
  }, [refundStatus, fareProductType, analytics, close]);

  return (
    <BottomSheetContainer
      title={t(FareContractTexts.refund.bottomSheetTitle)}
      focusTitleOnLoad={true}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
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
        {refundInfoUrl && (
          <Button
            mode="tertiary"
            text={t(FareContractTexts.refund.readMore)}
            onPress={() => Linking.openURL(refundInfoUrl)}
            expanded={true}
            rightIcon={{svg: SvgExternalLink}}
            backgroundColor={theme.color.background.neutral[1]}
            accessibilityLabel={t(FareContractTexts.refund.readMoreA11yLabel)}
          />
        )}
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
