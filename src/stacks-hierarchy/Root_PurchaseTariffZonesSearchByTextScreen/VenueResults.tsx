import {screenReaderPause} from '@atb/components/text';
import {LocationIcon} from '@atb/components/location-icon';
import {ThemeText} from '@atb/components/text';
import {SearchLocation} from '@atb/favorites';
import {getReferenceDataName, TariffZone} from '@atb/configuration';
import {StyleSheet} from '@atb/theme';
import {TariffZoneSearchTexts, useTranslation} from '@atb/translations';
import {insets} from '@atb/utils/insets';
import React from 'react';
import {View} from 'react-native';
import {PressableOpacity} from '@atb/components/pressable-opacity';

export type LocationAndTariffZone = {
  location: SearchLocation;
  tariffZone: TariffZone;
};

type Props = {
  locationsAndTariffZones: LocationAndTariffZone[];
  onSelect: (l: SearchLocation) => void;
};

export const VenueResults: React.FC<Props> = ({
  locationsAndTariffZones,
  onSelect,
}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  return (
    <>
      <View accessibilityRole="header" style={styles.subHeader}>
        <ThemeText typography="body__secondary" color="secondary">
          {t(TariffZoneSearchTexts.results.heading)}
        </ThemeText>
      </View>
      <View>
        {locationsAndTariffZones.map(({location, tariffZone}, index) => (
          <View style={styles.rowContainer} key={location.id}>
            <View style={styles.tariffZoneButtonContainer}>
              <PressableOpacity
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
                      TariffZoneSearchTexts.results.item.zoneLabel(
                        getReferenceDataName(tariffZone, language),
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
    backgroundColor: theme.color.foreground.dynamic.primary,
  },
}));
