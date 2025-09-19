import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {activateFareContractNow} from '@atb/modules/ticketing';
import {dictionary, FareContractTexts, useTranslation} from '@atb/translations';
import Bugsnag from '@bugsnag/react-native';
import React, {useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ErrorResponse} from '@atb-as/utils';

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
  const {theme} = useThemeContext();

  const {logEvent} = useBottomSheetContext();

  const onActivate = async () => {
    setIsLoading(true);
    try {
      await activateFareContractNow(fareContractId);
      logEvent('Ticketing', 'Activated fare contract ahead of time', {
        fareProductType,
      });
      close();
    } catch (e: any) {
      const error = e as ErrorResponse;
      Bugsnag.notify({
        name: `${error.http.code} error when activating fare contract ahead of time`,
        message: `Error: ${JSON.stringify(error)}`,
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
        <Button
          expanded={true}
          mode="secondary"
          onPress={close}
          text={t(dictionary.cancel)}
          backgroundColor={theme.color.background.neutral[1]}
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
      marginBottom: bottom + theme.spacing.medium,
    },
    contentContainer: {
      rowGap: theme.spacing.medium,
    },
  };
});
