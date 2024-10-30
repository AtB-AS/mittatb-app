import React from 'react';
import {SvgProps} from 'react-native-svg';
import {View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';

type Props = {
  svg?(props: SvgProps): JSX.Element;
  text: string;
};
export const IconText = ({svg, text}: Props) => {
  const style = useStyles();
  return (
    <View style={{flexDirection: 'row'}}>
      {svg && (
        <ThemeIcon
          style={(text ?? '').length > 0 ? style.icon : undefined}
          svg={svg}
        />
      )}
      <ThemeText type="body__primary--bold">{text}</ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  icon: {
    marginRight: theme.spacing.small,
  },
}));
