import {ThemeText} from '@atb/components/text';
import {RadioSegments} from '@atb/components/radio';
import React from 'react';
import {UseDebugOverride} from '@atb/debug/use-debug-override';
import {View} from 'react-native';
import { useTheme } from '@atb/theme';

type Props = {
  description?: String;
  override: UseDebugOverride;
};

export const DebugOverride = ({description, override}: Props) => {
  const {theme} = useTheme();
  const [overrideVal, setOverride] = override;
  return (
    <View style={{flex: 1}}>
      <ThemeText>{description}</ThemeText>
      <RadioSegments
        activeIndex={overrideVal ? 0 : overrideVal === undefined ? 1 : 2}
        color={theme.color.interactive[2]}
        style={{marginTop: 8}}
        options={[
          {
            text: 'True',
            onPress: () => setOverride(true),
          },
          {
            text: 'Undefined',
            onPress: () => setOverride(undefined),
          },
          {
            text: 'False',
            onPress: () => setOverride(false),
          },
        ]}
      />
    </View>
  );
};
