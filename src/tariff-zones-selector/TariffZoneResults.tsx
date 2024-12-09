import {Location} from '@atb/assets/svg/mono-icons/places';
import {Pin} from '@atb/assets/svg/mono-icons/map/';
import {screenReaderPause} from '@atb/components/text';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {getReferenceDataName, TariffZone} from '@atb/configuration';
import {StyleSheet} from '@atb/theme';
import {
  getTextForLanguage,
  TariffZoneSearchTexts,
  useTranslation,
} from '@atb/translations';
import {insets} from '@atb/utils/insets';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {useTariffZoneFromLocation} from '@atb/tariff-zones-selector/use-tariff-zone-from-location';
import {PressableOpacity} from '@atb/components/pressable-opacity';

type Props = {
  tariffZones: TariffZone[];
  onSelect: (tariffZone: TariffZone) => void;
};

export const TariffZoneResults: React.FC<Props> = ({tariffZones, onSelect}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const tariffZoneFromLocation = useTariffZoneFromLocation(tariffZones);
  return (
    <>
      <View accessibilityRole="header" style={styles.subHeader}>
        <ThemeText typography="body__secondary" color="secondary">
          {t(TariffZoneSearchTexts.zones.heading)}
        </ThemeText>
      </View>
      <ScrollView>
        {tariffZones.map((tariffZone) => (
          <View style={styles.rowContainer} key={tariffZone.id}>
            <View style={styles.tariffZoneButtonContainer}>
              <PressableOpacity
                accessible={true}
                accessibilityLabel={
                  t(
                    TariffZoneSearchTexts.zones.item.a11yLabel(
                      getReferenceDataName(tariffZone, language),
                    ),
                  ) + screenReaderPause
                }
                accessibilityHint={t(TariffZoneSearchTexts.zones.item.a11yHint)}
                accessibilityRole="button"
                hitSlop={insets.symmetric(8, 1)}
                onPress={() => onSelect(tariffZone)}
                style={styles.tariffZoneButton}
                testID={'tariffZone' + tariffZone.name.value + 'Button'}
              >
                <View style={{flexDirection: 'column'}}>
                  <ThemeIcon svg={Pin} width={20} />
                </View>
                <View style={styles.nameContainer}>
                  <ThemeText typography="body__primary--bold">
                    {getReferenceDataName(tariffZone, language)}
                  </ThemeText>
                  {tariffZone.description && (
                    <ThemeText typography="body__secondary">
                      {getTextForLanguage(tariffZone.description, language)}
                    </ThemeText>
                  )}
                </View>
                {tariffZoneFromLocation?.id === tariffZone.id ? (
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
  tariffZoneButtonContainer: {
    padding: 12,
    flex: 1,
  },
  tariffZoneButton: {
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
