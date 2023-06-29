import {screenReaderPause} from '@atb/components/text';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {insets} from '@atb/utils/insets';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Boat} from '@atb/assets/svg/mono-icons/transportation';
import {StopPlace, StopPlaces} from '@atb/api/types/stopPlaces';
import HarborSearchTexts from '@atb/translations/screens/subscreens/HarborSearch';

type Props = {
  harbors: StopPlaces;
  onSelect: (l: StopPlace) => void;
  searchText?: string;
  fromHarborName?: string;
};

export const HarborResults: React.FC<Props> = ({
  harbors,
  onSelect,
  searchText,
  fromHarborName,
}) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  return (
    <>
      <View accessibilityRole="header" style={styles.subHeader}>
        <ThemeText type="body__secondary" color="secondary">
          {fromHarborName
            ? t(HarborSearchTexts.results.arrivalHeading(fromHarborName))
            : searchText
            ? t(HarborSearchTexts.results.nearestHeading)
            : t(HarborSearchTexts.results.resultsHeading)}
        </ThemeText>
      </View>
      <View>
        {harbors.map((harbor, index) => (
          <View style={styles.rowContainer} key={harbor.id}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={
                  t(HarborSearchTexts.results.item.a11yLabel(harbor.name)) +
                  screenReaderPause
                }
                accessibilityHint={t(HarborSearchTexts.results.item.a11yHint)}
                accessibilityRole="button"
                hitSlop={insets.symmetric(8, 1)}
                onPress={() => onSelect(harbor)}
                style={styles.button}
                testID={'venueResult' + index}
              >
                <View style={{flexDirection: 'column'}}>
                  <ThemeIcon svg={Boat} />
                </View>
                <View style={styles.nameContainer}>
                  <ThemeText type={'body__primary--bold'}>
                    {harbor.name}
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
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  buttonContainer: {
    padding: theme.spacings.medium,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    marginHorizontal: theme.spacings.medium,
  },
}));
