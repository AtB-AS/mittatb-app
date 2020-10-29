import React from 'react';
import {Text, TextProps} from 'react-native';
import {fontSizes} from '../../theme/colors';
import {useTheme} from '../../theme';

type StyledTextProps = TextProps & {
  type?: keyof typeof fontSizes;
};

const ThemeText: React.FC<StyledTextProps> = ({
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
    <Text style={[typeStyle, style]} maxFontSizeMultiplier={2} {...props}>
      {children}
    </Text>
  );
};
export default ThemeText;
