import React from 'react';
import {Text as RNText, TextProps} from 'react-native';
import {StyleSheet} from '../../theme';

type StyledTextProps = TextProps & {};

const Text: React.FC<StyledTextProps> = ({style, children, ...props}) => {
  const styles = useStyle();

  return (
    <RNText {...props} style={[styles.default, style]}>
      {children}
    </RNText>
  );
};
const useStyle = StyleSheet.createThemeHook((theme) => ({
  default: {
    color: theme.text.colors.primary,
    fontSize: theme.text.sizes.body,
  },
}));
export default Text;
