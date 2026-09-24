import {ThemeText} from '@atb/components/text';
import {
  NavigationIcon,
  isNavigationIcon,
  NavigationIconTypes,
  ThemeIcon,
} from '@atb/components/theme-icon';
import {StyleSheet, useThemeContext} from '@atb/theme';
import React from 'react';
import {AccessibilityProps, View} from 'react-native';
import {SectionItemProps} from '../types';
import {NativeTouchable} from '@atb/components/native-touchable';
import {useSectionItem} from '..';
import {SvgProps} from 'react-native-svg';

export type SelectionInlineSectionItemProps = SectionItemProps<{
  label: string;
  value?: string;
  onPress: () => void;
  onPressLabel?: string;
  onPressIcon?: NavigationIconTypes | ((props: SvgProps) => React.JSX.Element);
  icon?: (props: SvgProps) => React.JSX.Element;
  iconAccessibility?: AccessibilityProps;
  accessibility?: AccessibilityProps;
  testID?: string;
}> &
  AccessibilityProps;

export function SelectionInlineSectionItem({
  onPress,
  onPressIcon,
  onPressLabel,
  accessibility,
  label,
  value,
  icon,
  iconAccessibility,
  ...props
}: SelectionInlineSectionItemProps) {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {topContainer, contentContainer} = useSectionItem(props);

  const onPressIconSize = !!onPressLabel ? 'small' : 'normal';
  const onPressIconEl =
    onPressIcon &&
    (isNavigationIcon(onPressIcon) ? (
      <NavigationIcon mode={onPressIcon} size={onPressIconSize} />
    ) : (
      <ThemeIcon
        svg={onPressIcon}
        size={onPressIconSize}
        color={theme.color.interactive[0].default.background}
      />
    ));

  return (
    <NativeTouchable
      variant="block"
      onPress={onPress}
      style={[topContainer, styles.container]}
      {...accessibility}
    >
      {icon && <ThemeIcon svg={icon} {...iconAccessibility} />}

      <View style={[contentContainer, styles.labelValueContainer]}>
        <ThemeText typography="body__m__strong">{label}</ThemeText>
        <ThemeText typography="body__s" type="secondary">
          {value}
        </ThemeText>
      </View>

      <View style={styles.onPressContainer}>
        {onPressLabel && (
          <ThemeText typography="body__s" accessible={false}>
            {onPressLabel}
          </ThemeText>
        )}

        {onPressIconEl}
      </View>
    </NativeTouchable>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing.medium,
    alignItems: 'center',
  },
  labelValueContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  onPressContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
}));
