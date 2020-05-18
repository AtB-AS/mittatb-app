import LogoOutline from './LogoOutline';
import {View, Text} from 'react-native';
import React from 'react';
import {StyleSheet} from '../theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CancelCrossIcon from '../assets/svg/CancelCrossIcon';
import insets from '../utils/insets';

type ScreenHeaderProps = {
  onClose?(): void;
  iconElement?: React.ReactNode;
  title: string;
};

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  onClose,
  iconElement,
  title,
}) => {
  const css = useHeaderStyle();
  const defaultIcon = onClose ? <CancelCrossIcon /> : <LogoOutline />;
  const iconEl = iconElement ?? defaultIcon;

  const icon = onClose ? (
    <TouchableOpacity onPress={onClose} hitSlop={insets.all(8)}>
      {iconEl}
    </TouchableOpacity>
  ) : (
    iconEl
  );

  return (
    <View style={css.container}>
      {icon}
      <View style={css.textContainer}>
        <Text style={css.text}>{title}</Text>
      </View>
    </View>
  );
};
export default ScreenHeader;

const useHeaderStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    padding: theme.sizes.pagePadding,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 20,
  },
  text: {
    color: theme.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
}));
