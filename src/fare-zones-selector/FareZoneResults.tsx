import {Location} from '@atb/assets/svg/mono-icons/places';
import {Pin} from '@atb/assets/svg/mono-icons/map/';
import {screenReaderPause} from '@atb/components/text';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {getReferenceDataName, FareZone} from '@atb/modules/configuration';
import {StyleSheet} from '@atb/theme';
import {
  getTextForLanguage,
  FareZoneSearchTexts,
  useTranslation,
} from '@atb/translations';
import {insets} from '@atb/utils/insets';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {useFareZoneFromLocation} from '@atb/fare-zones-selector/use-fare-zone-from-location';
import {PressableOpacity} from '@atb/components/pressable-opacity';

type Props = {
  fareZones: FareZone[];
  onSelect: (fareZone: FareZone) => void;
};

export const FareZoneResults: React.FC<Props> = ({fareZones, onSelect}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const fareZoneFromLocation = useFareZoneFromLocation(fareZones);
  return (
    <>
      <View accessibilityRole="header" style={styles.subHeader}>
        <ThemeText typography="body__s" color="secondary">
          {t(FareZoneSearchTexts.zones.heading)}
        </ThemeText>
      </View>
      <ScrollView>
        {fareZones.map((fareZone) => (
          <View style={styles.rowContainer} key={fareZone.id}>
            <View style={styles.fareZoneButtonContainer}>
              <PressableOpacity
                accessible={true}
                accessibilityLabel={
                  t(
                    FareZoneSearchTexts.zones.item.a11yLabel(
                      getReferenceDataName(fareZone, language),
                    ),
                  ) + screenReaderPause
                }
                accessibilityHint={t(FareZoneSearchTexts.zones.item.a11yHint)}
                accessibilityRole="button"
                hitSlop={insets.symmetric(8, 1)}
                onPress={() => onSelect(fareZone)}
                style={styles.fareZoneButton}
                testID={'fareZone' + fareZone.name.value + 'Button'}
              >
                <View style={{flexDirection: 'column'}}>
                  <ThemeIcon svg={Pin} width={20} />
                </View>
                <View style={styles.nameContainer}>
                  <ThemeText typography="body__m__strong">
                    {getReferenceDataName(fareZone, language)}
                  </ThemeText>
                  {fareZone.description && (
                    <ThemeText typography="body__s">
                      {getTextForLanguage(fareZone.description, language)}
                    </ThemeText>
                  )}
                </View>
                {fareZoneFromLocation?.id === fareZone.id ? (
                  <View style={styles.currentLocationIcon}>
                    <ThemeIcon svg={Location} />
                  </View>
                ) : null}
              </PressableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
    marginLeft: theme.spacing.large,
    flex: 1,
  },
  currentLocationIcon: {
    marginLeft: theme.spacing.small,
  },
}));
