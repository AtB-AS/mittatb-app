import {FareContractState} from '@atb-as/utils';
import SvgExternalLink from '@atb/assets/svg/mono-icons/navigation/ExternalLink';
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
import {View} from 'react-native';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet-v2';
import {RefObject} from '@testing-library/react-native/build/types';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {openInAppBrowser} from '@atb/modules/in-app-browser';

type Props = {
  orderId: string;
  fareProductType: string | undefined;
  state: FareContractState;
  bottomSheetModalRef: RefObject<GorhomBottomSheetModal | null>;
  onCloseFocusRef: RefObject<View | null>;
};

export const RefundBottomSheet = ({
  orderId,
  fareProductType,
  state,
  bottomSheetModalRef,
  onCloseFocusRef,
}: Props) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t, language} = useTranslation();
  const {configurableLinks} = useFirestoreConfigurationContext();
  const refundInfoUrl = getTextForLanguage(
    configurableLinks?.refundInfo,
    language,
  );
  const {logEvent} = useAnalyticsContext();

  const {data: refundOptions, status: refundOptionsStatus} =
    useRefundOptionsQuery(orderId, state);

  const {mutate: refund, status: refundStatus} =
    useRefundFareContractMutation();

  useEffect(() => {
    if (refundStatus === 'success') {
      logEvent('Ticketing', 'Ticket refunded', {
        fareProductType,
      });
      bottomSheetModalRef.current?.dismiss();
    }
  }, [refundStatus, fareProductType, logEvent, bottomSheetModalRef]);

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(FareContractTexts.refund.bottomSheetTitle)}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      closeCallback={() => giveFocus(onCloseFocusRef)}
    >
      <View style={styles.container}>
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
            onPress={() => openInAppBrowser(refundInfoUrl, 'close')}
            expanded={true}
            rightIcon={{svg: SvgExternalLink}}
            backgroundColor={theme.color.background.neutral[1]}
            accessibilityLabel={t(FareContractTexts.refund.readMoreA11yLabel)}
          />
        )}
      </View>
    </BottomSheetModal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      backgroundColor: theme.color.background.neutral[1].background,
      marginHorizontal: theme.spacing.medium,
      rowGap: theme.spacing.medium,
    },
  };
});
