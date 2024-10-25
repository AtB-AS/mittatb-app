import {ThemeText} from '@atb/components/text';
import {RadioSegments} from '@atb/components/radio';
import React from 'react';
import {View} from 'react-native';

type Props = {
  description?: String;
  overrideVal: boolean | undefined;
  setOverride: (b: boolean | undefined) => void;
};

export const DebugOverride = ({
  description,
  overrideVal,
  setOverride,
}: Props) => {
  return (
    <View style={{flex: 1}}>
      <ThemeText>{description}</ThemeText>
      <RadioSegments
        activeIndex={overrideVal ? 2 : overrideVal === undefined ? 1 : 0}
        color="interactive_2"
        style={{marginTop: 8}}
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
