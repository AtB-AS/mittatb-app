import {getErrorResponse} from '@atb/api/utils';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {consumeCarnet} from '@atb/modules/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';
import React, {useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  fareContractId: string;
  fareProductType: string | undefined;
};

export const ConsumeCarnetBottomSheet = ({
  fareContractId,
  fareProductType,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState<boolean>(false);
  const [isSchoolError, setSchoolError] = useState<boolean>(false);
  const {close} = useBottomSheetContext();
  const {logEvent} = useBottomSheetContext();

  const onConsume = async () => {
    setIsLoading(true);
    setError(false);
    setSchoolError(false);
    try {
      await consumeCarnet(fareContractId);
      logEvent('Ticketing', 'Consumed carnet', {
        fareProductType,
      });
      close();
    } catch (e: any) {
      const errorResponse = getErrorResponse(e);
      notifyBugsnag('Error when consuming carnet', {metadata: errorResponse});
      if (errorResponse?.kind === 'SCHOOL_CARNET_IS_NOT_CONSUMABLE') {
        setSchoolError(true);
      } else {
        setError(true);
      }
    }
    setIsLoading(false);
  };

  return (
    <BottomSheetContainer
      title={t(FareContractTexts.carnet.bottomSheetTitle)}
      focusTitleOnLoad={true}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
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
