import React, {useState} from 'react';
import {View} from 'react-native';
import {ContentHeading} from '@atb/components/heading';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {StyleSheet} from '@atb/theme';

type Props = {
  showZones: boolean;
  onFilterChanged: (showZones: boolean) => void;
};

export const ZoneFilters = ({showZones, onFilterChanged}: Props) => {
  const {t} = useTranslation();
  const [zonesFilter, setZonesFilter] = useState(showZones);

  const onShowZonesChanged = (value: boolean) => {
    setZonesFilter(value);
    onFilterChanged(value);
  };

  const styles = useStyles();

  return (
    <View style={styles.container}>
      <ContentHeading text={t(MobilityTexts.filter.sectionTitle.zones)} />
      <Section>
        <ToggleSectionItem
          text={t(MobilityTexts.filter.tariffZones)}
          value={zonesFilter}
          onValueChange={onShowZonesChanged}
          testID="tariffZonesToggle"
        />
      </Section>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {gap: theme.spacing.small},
}));
