import {useAnalyticsContext} from '@atb/modules/analytics';
import {getAxiosErrorMetadata} from '@atb/api/utils';
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
import {activateFareContractNow} from '@atb/modules/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import Bugsnag from '@bugsnag/react-native';
import React, {useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  fareContractId: string;
  fareProductType: string | undefined;
};

export const ActivateNowBottomSheet = ({
  fareContractId,
  fareProductType,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const {close} = useBottomSheetContext();
  const analytics = useAnalyticsContext();

  const onActivate = async () => {
    setIsLoading(true);
    try {
      await activateFareContractNow(fareContractId);
      analytics.logEvent('Ticketing', 'Activated fare contract ahead of time', {
        fareProductType,
      });
      close();
    } catch (e: any) {
      const errorData = getAxiosErrorMetadata(e);
      Bugsnag.notify({
        name: `${errorData.responseStatus} error when activating fare contract ahead of time`,
        message: `Error: ${JSON.stringify(errorData)}`,
      });
      setError(true);
    }
    setIsLoading(false);
  };

  return (
    <BottomSheetContainer
      title={t(FareContractTexts.activateNow.bottomSheetTitle)}
      focusTitleOnLoad={true}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
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
