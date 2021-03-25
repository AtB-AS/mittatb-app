import {MapPointPin} from '@atb/assets/svg/icons/places';
import {screenReaderPause} from '@atb/components/accessible-text';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {TariffZone} from '@atb/reference-data/types';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {StyleSheet} from '@atb/theme';
import {TariffZoneSearchTexts, useTranslation} from '@atb/translations';
import insets from '@atb/utils/insets';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';

type Props = {
  tariffZones: TariffZone[];
  onSelect: (tariffZone: TariffZone) => void;
};

const TariffZoneResults: React.FC<Props> = ({tariffZones, onSelect}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  return (
    <>
      <View accessibilityRole="header" style={styles.subHeader}>
        <ThemeText type="body__secondary" color="secondary">
          {t(TariffZoneSearchTexts.zones.heading)}
        </ThemeText>
      </View>
      <View>
        {tariffZones.map((tariffZone) => (
          <View style={styles.rowContainer} key={tariffZone.id}>
            <View style={styles.tariffZoneButtonContainer}>
              <TouchableOpacity
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
              >
                <View style={{flexDirection: 'column'}}>
                  <ThemeIcon svg={MapPointPin} width={20} />
                </View>
                <View style={styles.nameContainer}>
                  <ThemeText style={styles.nameText}>
                    {getReferenceDataName(tariffZone, language)}
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

export default TariffZoneResults;

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
}));
