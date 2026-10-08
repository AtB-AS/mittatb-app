import React, {useState} from 'react';
import {View} from 'react-native';
import {ContentHeading} from '@atb/components/heading';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {StyleSheet} from '@atb/theme';

type Props = {
  showFareZones: boolean;
  onFilterChanged: (showFareZones: boolean) => void;
};

export const FareZoneFilters = ({showFareZones, onFilterChanged}: Props) => {
  const {t} = useTranslation();
  const [shouldShow, setShouldShow] = useState(showFareZones);

  const onShowFareZonesChanged = (value: boolean) => {
    setShouldShow(value);
    onFilterChanged(value);
  };

  const styles = useStyles();

  return (
    <View style={styles.container}>
      <ContentHeading text={t(MobilityTexts.filter.sectionTitle.fareZones)} />
      <Section>
        <ToggleSectionItem
          text={t(MobilityTexts.filter.fareZones)}
          value={shouldShow}
          onValueChange={onShowFareZonesChanged}
          testID="fareZonesToggle"
        />
      </Section>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {gap: theme.spacing.small},
}));
