import React, {forwardRef} from 'react';
import {AccessibilityProps, TouchableOpacity, View} from 'react-native';
import {StyleSheet} from '../../theme';
import insets from '../../utils/insets';
import ThemeText from '../text';
import NavigationIcon, {
  isNavigationIcon,
  NavigationIconTypes,
} from '../theme-icon/navigation-icon';
import {SectionItem, useSectionItem} from './section-utils';

export type ButtonInputProps = SectionItem<{
  label: string;
  onPress(): void;
  onIconPress?(): void;
  iconAccessibility?: AccessibilityProps;
  placeholder?: string;
  value?: string | JSX.Element;
  icon?: NavigationIconTypes | JSX.Element;
}> &
  AccessibilityProps;

const ButtonInput = forwardRef<TouchableOpacity, ButtonInputProps>(
  (
    {
      onPress,
      value,
      placeholder,
      label,

      icon,
      onIconPress,
      iconAccessibility,

      ...props
    },
    ref,
  ) => {
    const {topContainer, contentContainer, spacing} = useSectionItem(props);
    const styles = useSymbolPickerStyle();
    const iconEl = isNavigationIcon(icon) ? (
      <NavigationIcon mode={icon} />
    ) : (
      icon
    );

    const wrapperStyle =
      props.type == 'compact' || props.type == 'inline'
        ? styles.wrapper__inline
        : undefined;

    const padding = {padding: spacing};

    const handlerWithoutPress = !onIconPress ? (
      <View style={[styles.iconContainer, padding]}>{iconEl}</View>
    ) : undefined;

    const handlerWithPress = onIconPress ? (
      <TouchableOpacity
        hitSlop={insets.all(12)}
        onPress={onIconPress}
        style={[styles.iconContainer, padding]}
        {...iconAccessibility}
      >
        <View>{iconEl}</View>
      </TouchableOpacity>
    ) : undefined;

    const valueEl =
      isStringText(value) || !value ? (
        <ThemeText type="body" style={!value && styles.faded}>
          {value ?? placeholder}
        </ThemeText>
      ) : (
        value
      );

    return (
      <View style={wrapperStyle}>
        <TouchableOpacity
          onPress={onPress}
          style={[styles.container, topContainer]}
          ref={ref}
          {...props}
        >
          <ThemeText type="lead" style={styles.label}>
            {label}
          </ThemeText>
          <View style={contentContainer}>{valueEl}</View>
          {handlerWithoutPress}
        </TouchableOpacity>
        {handlerWithPress}
      </View>
    );
  },
);

export default ButtonInput;

function isStringText(a: any): a is string {
  return typeof a === 'string';
}

const useSymbolPickerStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.background.level0,
    paddingRight: 40,
  },
  wrapper__inline: {
    alignSelf: 'flex-start',
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
  },
  label: {
    // @TODO Find a better way to do this.
    minWidth: 60 - theme.spacings.medium,
  },
  faded: {
    color: theme.text.colors.faded,
  },
}));
