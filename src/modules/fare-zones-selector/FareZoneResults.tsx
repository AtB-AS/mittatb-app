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
import {NativeTouchable} from '@atb/components/native-touchable';

type Props = {
  fareZones: FareZone[];
  onSelect: (fareZone: FareZone) => void;
};

export const FareZoneResults: React.FC<Props> = ({fareZones, onSelect}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  return (
    <>
      <View accessibilityRole="header" style={styles.subHeader}>
        <ThemeText typography="body__s" type="secondary">
          {t(FareZoneSearchTexts.zones.heading)}
        </ThemeText>
      </View>
      <ScrollView>
        {fareZones.map((fareZone) => (
          <View style={styles.rowContainer} key={fareZone.id}>
            <View style={styles.fareZoneButtonContainer}>
              <NativeTouchable
                variant="block"
                accessible={true}
                accessibilityLabel={
                  t(
                    FareZoneSearchTexts.zones.item.a11yLabel(
                      getReferenceDataName(fareZone, language),
                    ),
                  ) +
                  screenReaderPause +
                  getTextForLanguage(fareZone.description, language)
                }
                accessibilityHint={t(FareZoneSearchTexts.zones.item.a11yHint)}
                accessibilityRole="button"
                hitSlop={insets.symmetric(8, 1)}
                onPress={() => onSelect(fareZone)}
                style={styles.fareZoneButton}
                testID={'fareZone' + fareZone.name.value + 'Button'}
              >
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
                <ThemeIcon svg={Pin} width={20} />
              </NativeTouchable>
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
    padding: theme.spacing.medium,
    flex: 1,
  },
  fareZoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  nameContainer: {
    flex: 1,
  },
}));
