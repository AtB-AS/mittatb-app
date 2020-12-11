import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {StyleSheet} from '../theme';
import insets from '../utils/insets';
import ThemeText from '../components/text';
import ThemeIcon from '../components/theme-icon';
import {screenReaderPause} from '../components/accessible-text';
import {TariffZone} from '../api/tariffZones';
import {MapPointPin} from '../assets/svg/icons/places';
import {TariffZoneSearchTexts, useTranslation} from '../translations';

type Props = {
  title?: string;
  tariffZones: TariffZone[];
  onSelect: (tariffZone: TariffZone) => void;
};

const TariffZoneResults: React.FC<Props> = ({title, tariffZones, onSelect}) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  return (
    <>
      {title && (
        <View accessibilityRole="header" style={styles.subHeader}>
          <ThemeText type="lead" color="faded">
            {title}
          </ThemeText>
        </View>
      )}
      <View>
        {tariffZones.map((tariffZone) => (
          <View style={styles.rowContainer} key={tariffZone.id}>
            <View style={styles.tariffZoneButtonContainer}>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={
                  t(TariffZoneSearchTexts.results.item.a11yLabelPrefix) +
                  tariffZone.name.value +
                  screenReaderPause
                }
                accessibilityHint={t(
                  TariffZoneSearchTexts.results.item.a11yHint,
                )}
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
                    {tariffZone.name.value}
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
