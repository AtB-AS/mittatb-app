import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {StyleSheet} from '../theme';
import insets from '../utils/insets';
import ThemeText from '../components/text';
import {screenReaderPause} from '../components/accessible-text';
import {TariffZoneSearchTexts, useTranslation} from '../translations';
import {Location} from '../favorites/types';
import LocationIcon from '../components/location-icon';
import {TariffZone} from '../reference-data/types';

export type LocationAndTariffZone = {
  location: Location;
  tariffZone: TariffZone;
};

type Props = {
  locationsAndTariffZones: LocationAndTariffZone[];
  onSelect: (l: Location) => void;
};

const VenueResults: React.FC<Props> = ({locationsAndTariffZones, onSelect}) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  return (
    <>
      <View accessibilityRole="header" style={styles.subHeader}>
        <ThemeText type="lead" color="faded">
          {t(TariffZoneSearchTexts.results.heading)}
        </ThemeText>
      </View>
      <View>
        {locationsAndTariffZones.map(({location, tariffZone}) => (
          <View style={styles.rowContainer} key={location.id}>
            <View style={styles.tariffZoneButtonContainer}>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={
                  t(
                    TariffZoneSearchTexts.results.item.a11yLabel(
                      location.name,
                      tariffZone.name.value,
                    ),
                  ) + screenReaderPause
                }
                accessibilityHint={t(
                  TariffZoneSearchTexts.results.item.a11yHint,
                )}
                accessibilityRole="button"
                hitSlop={insets.symmetric(8, 1)}
                onPress={() => onSelect(location)}
                style={styles.tariffZoneButton}
              >
                <View style={{flexDirection: 'column'}}>
                  <LocationIcon
                    location={location}
                    fill={String(styles.locationIcon.backgroundColor)}
                    multiple={true}
                  />
                </View>
                <View style={styles.nameContainer}>
                  <ThemeText type={'paragraphHeadline'}>
                    {location.name}
                  </ThemeText>
                  <ThemeText type={'lead'}>
                    {t(
                      TariffZoneSearchTexts.results.item.zoneLabel(
                        tariffZone.name.value,
                      ),
                    )}
                  </ThemeText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

export default VenueResults;

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  subHeader: {
    padding: theme.spacings.medium,
    margin: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  tariffZoneButtonContainer: {
    padding: 12,
    flex: 1,
  },
  tariffZoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    marginLeft: 16,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
  },
  zoneText: {
    fontSize: 14,
    marginTop: 2,
  },
  locationIcon: {
    backgroundColor: theme.text.colors.primary,
  },
}));
