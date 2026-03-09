import React from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {View} from 'react-native';
import {BatteryHigh} from '@atb/assets/svg/mono-icons/miscellaneous';
import {VehicleCardStat} from './VehicleCardStat';
import {ScooterTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {
  formatRange,
  getBatteryLevelIcon,
  getThemedIllustrationForFormFactor,
} from '../utils';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

type Props = {
  currentFuelPercent: number | undefined;
  currentRangeMeters: number;
  formFactor?: FormFactor;
};

export const VehicleCard = ({
  currentFuelPercent,
  currentRangeMeters,
  formFactor,
}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const ThemedIllustration = formFactor
    ? getThemedIllustrationForFormFactor(formFactor)
    : null;

  return (
    <Section>
      <GenericSectionItem style={styles.sectionWrapper}>
        <View style={styles.content}>
          <VehicleCardStat
            icon={
              currentFuelPercent
                ? getBatteryLevelIcon(currentFuelPercent)
                : BatteryHigh
            }
            stat={formatRange(currentRangeMeters, language)}
            description={t(ScooterTexts.range)}
          />
          {!!ThemedIllustration && (
            <ThemedIllustration width={50} height={50} />
          )}
        </View>
      </GenericSectionItem>
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.small,
    },

    sectionWrapper: {
      padding: theme.spacing.small,
    },
  };
});
