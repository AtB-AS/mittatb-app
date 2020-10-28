import React from 'react';
import {Text as RNText, TextProps} from 'react-native';
import {fontSizes} from '../../theme/colors';
import {useTheme} from '../../theme';

type StyledTextProps = TextProps & {
  type?: keyof typeof fontSizes;
};

const Text: React.FC<StyledTextProps> = ({
  type: fontType = 'body',
  style,
  children,
  ...props
}) => {
  const {theme} = useTheme();

  const typeStyle = {
    fontSize: theme.text.sizes[fontType],
    lineHeight: theme.text.lineHeight[fontType],
    color: theme.text.colors.primary,
  };

  return (
    <RNText style={[typeStyle, style]} maxFontSizeMultiplier={2} {...props}>
      {children}
    </RNText>
  );
};
export default Text;
