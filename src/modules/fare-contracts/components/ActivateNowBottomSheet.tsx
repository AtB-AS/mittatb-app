import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {activateFareContractNow} from '@atb/modules/ticketing';
import {dictionary, FareContractTexts, useTranslation} from '@atb/translations';
import Bugsnag from '@bugsnag/react-native';
import React, {RefObject, useState} from 'react';
import {RequestError} from '@atb/api/utils';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet-v2';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import {View} from 'react-native';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {useAnalyticsContext} from '@atb/modules/analytics';

type Props = {
  fareContractId: string;
  fareProductType: string | undefined;
  bottomSheetModalRef: RefObject<GorhomBottomSheetModal | null>;
  onCloseFocusRef: RefObject<View | null>;
};

export const ActivateNowBottomSheet = ({
  fareContractId,
  fareProductType,
  bottomSheetModalRef,
  onCloseFocusRef,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const {theme} = useThemeContext();
  const {logEvent} = useAnalyticsContext();

  const onActivate = async () => {
    setIsLoading(true);
    try {
      await activateFareContractNow(fareContractId);
      logEvent('Ticketing', 'Activated fare contract ahead of time', {
        fareProductType,
      });
      bottomSheetModalRef.current?.dismiss();
    } catch (e: any) {
      const error = e as RequestError;
      const httpCode = error.http?.code ?? 'UNKNOWN';
      Bugsnag.notify({
        name: `${httpCode} error when activating fare contract ahead of time`,
        message: `Error: ${JSON.stringify(error)}`,
      });
      setError(true);
    }
    setIsLoading(false);
  };

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(FareContractTexts.activateNow.bottomSheetTitle)}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      closeCallback={() => giveFocus(onCloseFocusRef)}
    >
      <View style={styles.container}>
        {error && (
          <MessageInfoBox
            message={t(FareContractTexts.activateNow.genericError)}
            type="error"
          />
        )}
        <Section>
          <GenericSectionItem type="spacious">
            <ThemeText>
              {t(FareContractTexts.activateNow.bottomSheetDescription)}
            </ThemeText>
          </GenericSectionItem>
        </Section>
        <Button
          expanded={true}
          onPress={onActivate}
          text={t(FareContractTexts.activateNow.confirm)}
          rightIcon={{svg: Confirm}}
          loading={isLoading}
        />
        <Button
          expanded={true}
          mode="secondary"
          onPress={() => bottomSheetModalRef.current?.dismiss()}
          text={t(dictionary.cancel)}
          backgroundColor={theme.color.background.neutral[1]}
        />
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
