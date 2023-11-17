import React from 'react';
import {SvgProps} from 'react-native-svg';
import {View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {useTheme} from '@atb/theme';

type Props = {
  svg?(props: SvgProps): JSX.Element;
  text: string;
};
export const MobilityIconText = ({svg, text}: Props) => {
  const {theme} = useTheme();
  return (
    <View style={{flexDirection: 'row'}}>
      {svg && (
        <ThemeIcon
          style={
            (text ?? '').length > 0
              ? {marginRight: theme.spacings.small}
              : undefined
          }
          svg={svg}
          color={theme.text.colors.secondary}
          fill={theme.text.colors.secondary}
        />
      )}
      <ThemeText type='body__secondary--bold' color='secondary'>
        {text}
      </ThemeText>
    </View>
  );
};
