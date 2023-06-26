import {screenReaderPause} from '@atb/components/text';
import {ThemeText} from '@atb/components/text';
import {BoatStopPoint} from '@atb/reference-data/types';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {insets} from '@atb/utils/insets';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import BoatStopPointSearchTexts from '@atb/translations/screens/subscreens/BoatStopPointSearch';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Boat} from '@atb/assets/svg/mono-icons/transportation';

type Props = {
  boatStopPoints: BoatStopPoint[];
  onSelect: (l: BoatStopPoint) => void;
  showingNearest?: boolean;
};

export const HarborResult: React.FC<Props> = ({
  boatStopPoints,
  onSelect,
  showingNearest = false,
}) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  return (
    <>
      <View accessibilityRole="header" style={styles.subHeader}>
        <ThemeText type="body__secondary" color="secondary">
          {showingNearest
            ? t(BoatStopPointSearchTexts.results.nearestHeading)
            : t(BoatStopPointSearchTexts.results.resultsHeading)}
        </ThemeText>
      </View>
      <View>
        {boatStopPoints.map((boatStopPoint, index) => (
          <View style={styles.rowContainer} key={boatStopPoint.id}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={
                  t(
                    BoatStopPointSearchTexts.results.item.a11yLabel(
                      boatStopPoint.name,
                    ),
                  ) + screenReaderPause
                }
                accessibilityHint={t(
                  BoatStopPointSearchTexts.results.item.a11yHint,
                )}
                accessibilityRole="button"
                hitSlop={insets.symmetric(8, 1)}
                onPress={() => onSelect(boatStopPoint)}
                style={styles.button}
                testID={'venueResult' + index}
              >
                <View style={{flexDirection: 'column'}}>
                  <ThemeIcon svg={Boat} />
                </View>
                <View style={styles.nameContainer}>
                  <ThemeText type={'body__primary--bold'}>
                    {boatStopPoint.name}
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
  buttonContainer: {
    padding: 12,
    flex: 1,
  },
  button: {
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
