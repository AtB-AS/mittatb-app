import {FareContractState} from '@atb-as/utils';
import SvgExternalLink from '@atb/assets/svg/mono-icons/navigation/ExternalLink';
import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useRefundFareContractMutation} from '@atb/modules/ticketing';
import {useRefundOptionsQuery} from '@atb/modules/ticketing';
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
  state: FareContractState;
};

export const RefundBottomSheet = ({orderId, fareProductType, state}: Props) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t, language} = useTranslation();
  const {configurableLinks} = useFirestoreConfigurationContext();
  const refundInfoUrl = getTextForLanguage(
    configurableLinks?.refundInfo,
    language,
  );
  const {close} = useBottomSheetContext();
  const {data: refundOptions, status: refundOptionsStatus} =
    useRefundOptionsQuery(orderId, state);
  const {logEvent} = useBottomSheetContext();

  const {mutate: refund, status: refundStatus} =
    useRefundFareContractMutation();

  useEffect(() => {
    if (refundStatus === 'success') {
      logEvent('Ticketing', 'Ticket refunded', {
        fareProductType,
      });
      close();
    }
  }, [refundStatus, fareProductType, close, logEvent]);

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
          disabled={!refundOptions?.isRefundable}
          loading={
            refundStatus === 'pending' || refundOptionsStatus === 'pending'
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
  const {bottom: bottomSafeAreaInset} = useSafeAreaInsets();
  return {
    container: {
      backgroundColor: theme.color.background.neutral[1].background,
      marginHorizontal: theme.spacing.medium,
      marginBottom: bottomSafeAreaInset + theme.spacing.medium,
    },
    contentContainer: {
      rowGap: theme.spacing.medium,
    },
  };
});
