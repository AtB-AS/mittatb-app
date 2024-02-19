import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  fareContractId: string;
};

export const ConsumeCarnetBottomSheet = ({fareContractId}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <BottomSheetContainer
      title={t(FareContractTexts.carnet.bottomSheetTitle)}
      focusTitleOnLoad={true}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Section>
          <GenericSectionItem type="spacious">
            <ThemeText>
              {t(FareContractTexts.carnet.bottomSheetDescription)}
            </ThemeText>
          </GenericSectionItem>
        </Section>
        <Button
          onPress={() => {
            // @TODO: Implement activation of carnet
            console.log(fareContractId);
          }}
          text={t(FareContractTexts.carnet.activateCarnet)}
          rightIcon={{svg: Confirm}}
        />
      </ScrollView>
    </BottomSheetContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    container: {
      backgroundColor: theme.static.background.background_1.background,
      marginHorizontal: theme.spacings.medium,
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
    contentContainer: {
      rowGap: theme.spacings.medium,
    },
  };
});
