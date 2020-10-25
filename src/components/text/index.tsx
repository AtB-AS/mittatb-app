import React from 'react';
import {Text, TextProps} from 'react-native';
import {StyleSheet} from '../../theme';

type StyledTextProps = TextProps & {};

const ThemedText: React.FC<StyledTextProps> = ({style, children, ...props}) => {
  const styles = useStyle();

  return (
    <Text {...props} style={[styles.default, style]}>
      {children}
    </Text>
  );
};
const useStyle = StyleSheet.createThemeHook((theme) => ({
  default: {
    color: theme.text.colors.primary,
    fontSize: theme.text.sizes.body,
  },
}));
export default ThemedText;
