import React from 'react';
import {View} from 'react-native';
import {ThemeIcon, type IconColor} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {SvgProps} from 'react-native-svg';

type StatusTextProps = {
  svg: (props: SvgProps) => React.JSX.Element;
  color: IconColor;
  text: string;
};

export const StatusText: React.FC<StatusTextProps> = ({svg, color, text}) => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ThemeIcon svg={svg} color={color} size="xSmall" />
      <ThemeText typography="body__s__strong" color={color}>
        {text}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xSmall,
  },
}));
