import {screenReaderPause} from '@atb/components/text';
import {LocationIcon} from '@atb/components/location-icon';
import {ThemeText} from '@atb/components/text';
import {SearchLocation} from '@atb/modules/favorites';
import {getReferenceDataName, FareZone} from '@atb/modules/configuration';
import {StyleSheet} from '@atb/theme';
import {FareZoneSearchTexts, useTranslation} from '@atb/translations';
import {insets} from '@atb/utils/insets';
import React from 'react';
import {View} from 'react-native';
import {PressableOpacity} from '@atb/components/pressable-opacity';

export type LocationAndFareZone = {
  location: SearchLocation;
  fareZone: FareZone;
};

type Props = {
  locationsAndFareZones: LocationAndFareZone[];
  onSelect: (l: SearchLocation) => void;
};

export const VenueResults: React.FC<Props> = ({
  locationsAndFareZones,
  onSelect,
}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  return (
    <>
      <View accessibilityRole="header" style={styles.subHeader}>
        <ThemeText typography="body__secondary" color="secondary">
          {t(FareZoneSearchTexts.results.heading)}
        </ThemeText>
      </View>
      <View>
        {locationsAndFareZones.map(({location, fareZone}, index) => (
          <View style={styles.rowContainer} key={location.id}>
            <View style={styles.fareZoneButtonContainer}>
              <PressableOpacity
                accessible={true}
                accessibilityLabel={
                  t(
                    FareZoneSearchTexts.results.item.a11yLabel(
                      location.name,
                      getReferenceDataName(fareZone, language),
                    ),
                  ) + screenReaderPause
                }
                accessibilityHint={t(
                  FareZoneSearchTexts.results.item.a11yHint,
                )}
                accessibilityRole="button"
                hitSlop={insets.symmetric(8, 1)}
                onPress={() => onSelect(location)}
                style={styles.fareZoneButton}
                testID={'venueResult' + index}
              >
                <View style={{flexDirection: 'column'}}>
                  <LocationIcon
                    location={location}
                    fill={String(styles.locationIcon.backgroundColor)}
                    multiple={true}
                  />
                </View>
                <View style={styles.nameContainer}>
                  <ThemeText typography="body__primary--bold">
                    {location.name}
                  </ThemeText>
                  <ThemeText typography="body__secondary">
                    {t(
                      FareZoneSearchTexts.results.item.zoneLabel(
                        getReferenceDataName(fareZone, language),
                      ),
                    )}
                  </ThemeText>
                </View>
              </PressableOpacity>
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  subHeader: {
    padding: theme.spacing.medium,
    margin: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  fareZoneButtonContainer: {
    padding: 12,
    flex: 1,
  },
  fareZoneButton: {
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
    backgroundColor: theme.color.foreground.dynamic.primary,
  },
}));
