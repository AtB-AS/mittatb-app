import {RadioSegments} from '@atb/components/radio';
import React from 'react';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {TravelSearchPreferenceWithSelectionType} from '@atb/travel-search-filters/types';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';

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
  const selectedIndex = preference.options.findIndex(
    (o) => preference.selectedOption === o.id,
  );

  return (
    <View style={containerStyle}>
      <ThemeText style={styles.heading} type="body__primary--bold">
        {getTextForLanguage(preference.title, language)}
      </ThemeText>
      <Section>
        <GenericSectionItem>
          <RadioSegments
            activeIndex={selectedIndex}
            color="interactive_2"
            options={preference.options.map((option) => ({
              text: getTextForLanguage(option.text, language) ?? '',
              onPress: () => {
                onPreferenceChange({...preference, selectedOption: option.id});
              },
            }))}
          />
        </GenericSectionItem>
      </Section>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  heading: {
    marginBottom: theme.spacings.medium,
  },
}));
