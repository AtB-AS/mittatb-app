import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {StyleSheet} from '../../theme';
import ThemeText from '../text';
import NavigationIcon, {
  isNavigationIcon,
  NavigationIconTypes,
} from '../theme-icon/navigation-icon';

type ButtonInputProps = {
  label: string;
  onPress(): void;
  value?: JSX.Element;
  icon?: NavigationIconTypes | JSX.Element;
  type?: 'inline' | 'block';
};
export default function ButtonInput({
  onPress,
  value,
  label,
  icon,
  type = 'block',
}: ButtonInputProps) {
  const style = useSymbolPickerStyle();
  const iconEl =
    isNavigationIcon(icon) || !icon ? <NavigationIcon mode={icon} /> : icon;

  const containerStyle = [
    style.container,
    type == 'inline' ? style.container__inline : undefined,
  ];
  const valueStyle = [
    style.value,
    type == 'inline' ? style.value__inline : undefined,
  ];

  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <View style={valueStyle}>{value}</View>
      {iconEl}
      <ThemeText type="lead" style={style.label}>
        {label}
      </ThemeText>
    </TouchableOpacity>
  );
}

const useSymbolPickerStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.spacings.medium,
    paddingLeft: 64,
    flexDirection: 'row',
    backgroundColor: theme.background.level1,
    borderRadius: theme.border.radius.regular,
  },
  container__inline: {
    alignSelf: 'flex-start',
  },
  value: {
    flex: 1,
    marginRight: theme.spacings.xLarge,
  },
  value__inline: {
    flex: 0,
  },
  label: {
    position: 'absolute',
    left: 0,
    padding: theme.spacings.medium,
  },
}));
