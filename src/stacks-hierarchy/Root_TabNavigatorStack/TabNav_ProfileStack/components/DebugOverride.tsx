import {ThemeText} from '@atb/components/text';
import {RadioSegments} from '@atb/components/radio';
import React from 'react';
import {View} from 'react-native';
import {useThemeContext} from '@atb/theme';

type Props = {
  name: string;
  overrideVal: boolean | undefined;
  setOverride: (b: boolean | undefined) => void;
};

export const DebugOverride = ({name, overrideVal, setOverride}: Props) => {
  const {theme} = useThemeContext();

  return (
    <View style={{flex: 1}}>
      <ThemeText typography="heading__m">{cleanUpDescription(name)}</ThemeText>
      <RadioSegments
        activeIndex={overrideVal ? 2 : overrideVal === undefined ? 1 : 0}
        color={theme.color.interactive[3]}
        style={{marginTop: theme.spacing.small}}
        options={[
          {
            text: 'False',
            onPress: () => setOverride(false),
          },
          {
            text: 'Undefined',
            onPress: () => setOverride(undefined),
          },
          {
            text: 'True',
            onPress: () => setOverride(true),
          },
        ]}
      />
    </View>
  );
};

/* Converts "isFancyFeatureEnabled" to "Fancy feature" */
const cleanUpDescription = (name: string) => {
  return name
    .replace(/^is/, '') // Remove "is" prefix
    .replace(/Enabled$/, '') // Remove "Enabled" suffix
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camel case
    .toLocaleLowerCase() // Convert to lowercase
    .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first letter
    .trim();
};
