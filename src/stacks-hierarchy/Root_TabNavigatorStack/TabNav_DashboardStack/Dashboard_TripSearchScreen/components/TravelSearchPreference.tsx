import {RadioSegments} from '@atb/components/radio';
import React from 'react';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {TravelSearchPreferenceWithSelectionType} from '@atb/modules/travel-search-filters';
import {ThemeText} from '@atb/components/text';
import {StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';

type Props = {
  preference: TravelSearchPreferenceWithSelectionType;
  onPreferenceChange: (value: TravelSearchPreferenceWithSelectionType) => void;
  style?: StyleProp<ViewStyle>;
};
export const TravelSearchPreference = ({
  preference,
  onPreferenceChange,
  style: containerStyle,
}: Props) => {
  const {language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const selectedIndex = preference.options.findIndex(
    (o) => preference.selectedOption === o.id,
  );

  return (
    <View style={containerStyle}>
      <ThemeText style={styles.heading} typography="body__secondary">
        {getTextForLanguage(preference.title, language)}
      </ThemeText>
      <RadioSegments
        activeIndex={selectedIndex}
        color={theme.color.interactive[2]}
        options={preference.options.map((option) => ({
          text: getTextForLanguage(option.text, language) ?? '',
          onPress: () => {
            onPreferenceChange({...preference, selectedOption: option.id});
          },
        }))}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  heading: {
    marginBottom: theme.spacing.medium,
  },
}));
