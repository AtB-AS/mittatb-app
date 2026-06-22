import React, {useState} from 'react';
import {View} from 'react-native';
import {ContentHeading} from '@atb/components/heading';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {StyleSheet} from '@atb/theme';

type Props = {
  showTariffZones: boolean;
  onFilterChanged: (showTariffZones: boolean) => void;
};

export const TariffZoneFilters = ({
  showTariffZones,
  onFilterChanged,
}: Props) => {
  const {t} = useTranslation();
  const [shouldShow, setShouldShow] = useState(showTariffZones);

  const onShowTariffZonesChanged = (value: boolean) => {
    setShouldShow(value);
    onFilterChanged(value);
  };

  const styles = useStyles();

  return (
    <View style={styles.container}>
      <ContentHeading text={t(MobilityTexts.filter.sectionTitle.tariffZones)} />
      <Section>
        <ToggleSectionItem
          text={t(MobilityTexts.filter.tariffZones)}
          value={shouldShow}
          onValueChange={onShowTariffZonesChanged}
          testID="tariffZonesToggle"
        />
      </Section>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {gap: theme.spacing.small},
}));
