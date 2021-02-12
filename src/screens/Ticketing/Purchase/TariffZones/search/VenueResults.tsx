import {screenReaderPause} from '@atb/components/accessible-text';
import LocationIcon from '@atb/components/location-icon';
import ThemeText from '@atb/components/text';
import {Location} from '@atb/favorites/types';
import {TariffZone} from '@atb/reference-data/types';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {StyleSheet} from '@atb/theme';
import {TariffZoneSearchTexts, useTranslation} from '@atb/translations';
import insets from '@atb/utils/insets';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';

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
  const {t, language} = useTranslation();
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
                      getReferenceDataName(tariffZone, language),
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
                        getReferenceDataName(tariffZone, language),
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
