import React from 'react';
import {Text, View} from 'react-native';
import LogoOutline from '../../../assets/svg/LogoOutline';
import {StyleSheet} from '../../../theme';

const Header: React.FC = ({children}) => {
  const css = useHeaderStyle();
  return (
    <View style={css.container}>
      <LogoOutline />
      <View style={css.textContainer}>
        <Text style={css.text}>{children}</Text>
      </View>
    </View>
  );
};

export default Header;

const useHeaderStyle = StyleSheet.createThemeHook(theme => ({
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
