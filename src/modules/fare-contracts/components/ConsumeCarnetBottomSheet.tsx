import {RequestError} from '@atb/api/utils';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {consumeCarnet} from '@atb/modules/ticketing';
import {dictionary, FareContractTexts, useTranslation} from '@atb/translations';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';
import React, {useState} from 'react';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet-v2';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {View} from 'react-native';
import {RefObject} from '@testing-library/react-native/build/types';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import {useAnalyticsContext} from '@atb/modules/analytics';

type Props = {
  fareContractId: string;
  fareProductType: string | undefined;
  bottomSheetModalRef: RefObject<GorhomBottomSheetModal | null>;
  onCloseFocusRef: RefObject<View | null>;
};

export const ConsumeCarnetBottomSheet = ({
  fareContractId,
  fareProductType,
  bottomSheetModalRef,
  onCloseFocusRef,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState<boolean>(false);
  const [isSchoolError, setSchoolError] = useState<boolean>(false);
  const {theme} = useThemeContext();
  const {logEvent} = useAnalyticsContext();

  const onConsume = async () => {
    setIsLoading(true);
    setError(false);
    setSchoolError(false);
    try {
      await consumeCarnet(fareContractId);
      logEvent('Ticketing', 'Consumed carnet', {
        fareProductType,
      });
      bottomSheetModalRef.current?.dismiss();
    } catch (e: any) {
      const error = e as RequestError;
      notifyBugsnag('Error when consuming carnet', {metadata: e});
      if (error.kind === 'SCHOOL_CARNET_IS_NOT_CONSUMABLE') {
        setSchoolError(true);
      } else {
        setError(true);
      }
    }
    setIsLoading(false);
  };

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(FareContractTexts.carnet.bottomSheetTitle)}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      closeCallback={() => giveFocus(onCloseFocusRef)}
      testID="selectFavorite"
    >
      <View style={styles.container}>
        {isError && (
          <MessageInfoBox
            message={t(FareContractTexts.carnet.genericError)}
            type="error"
          />
        )}
        {isSchoolError && (
          <MessageInfoBox
            title={t(FareContractTexts.carnet.schoolErrorTitle)}
            message={t(FareContractTexts.carnet.schoolErrorMessage)}
            type="warning"
          />
        )}
        <Section>
          <GenericSectionItem type="spacious">
            <ThemeText>
              {t(FareContractTexts.carnet.bottomSheetDescription)}
            </ThemeText>
          </GenericSectionItem>
        </Section>
        <Button
          expanded={true}
          onPress={onConsume}
          text={t(FareContractTexts.carnet.activateCarnet)}
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
