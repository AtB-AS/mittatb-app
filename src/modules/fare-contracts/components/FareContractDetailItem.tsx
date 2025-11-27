import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {useThemeContext} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {SvgProps} from 'react-native-svg';
import {Size, getContentTypography} from '../utils';

export function FareContractDetailItem({
  header,
  content,
  icon,
  size = 'normal',
}: {
  icon?: (props: SvgProps) => React.JSX.Element;
  header?: string;
  content: string;
  size?: Size;
}) {
  const styles = useStyles();
  const {theme} = useThemeContext();

  const headerTextColor = theme.color.foreground.dynamic.secondary;

  return (
    <View style={styles.container}>
      {header && (
        <ThemeText typography="body__s" color={headerTextColor}>
          {header}
        </ThemeText>
      )}
      <View style={styles.contentContainer}>
        {icon && <ThemeIcon svg={icon} size={size} />}
        <ThemeText typography={getContentTypography(size)}>{content}</ThemeText>
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
  },
}));
