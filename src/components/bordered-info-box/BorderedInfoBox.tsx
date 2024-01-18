import {
  flatStaticColors,
  InteractiveColor,
  isStaticColor,
  StaticColor,
} from '@atb/theme/colors';
import {ThemeText} from '@atb/components/text';
import {StyleProp, View, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {addOpacity} from '@atb/utils/add-opacity';
import {ContrastColor} from '@atb-as/theme';

type Props =
  | {
      /** The background color of the component where this box is placed */
      backgroundColor: StaticColor | InteractiveColor;
      type: 'large' | 'small';
      style?: StyleProp<ViewStyle>;
    } & ({text: string} | {children: ReactNode});

/**
 * A bordered info box, where the border color is based on the text color of the
 * background where it is applied. The component can be used either by sending
 * in text or children, but if using children remember to ensure correct
 * typography and text color on the child component.
 */
export const BorderedInfoBox = ({
  type,
  backgroundColor,
  style,
  ...props
}: Props) => {
  const contrastColor = useContrastColor(backgroundColor);
  const styles = useStyles(type, contrastColor.text);
  return (
    <View style={[styles.container, style]}>
      {'text' in props ? (
        <ThemeText type="body__tertiary" color={contrastColor}>
          {props.text}
        </ThemeText>
      ) : (
        props.children
      )}
    </View>
  );
};

/**
 * Find the contrast color to use, based on given static or interactive color
 */
function useContrastColor(
  backgroundColor: Props['backgroundColor'],
): ContrastColor {
  const {theme, themeName} = useTheme();
  if (isStaticColor(backgroundColor)) {
    return flatStaticColors[themeName][backgroundColor];
  }
  return theme.interactive[backgroundColor].default;
}

const useStyles = (type: Props['type'], textColor: string) =>
  StyleSheet.createThemeHook((theme) => ({
    container: {
      borderColor: addOpacity(textColor, 0.1),
      borderWidth: theme.border.width.slim,
      borderRadius: theme.border.radius.regular,
      paddingHorizontal:
        type === 'large' ? theme.spacings.medium : theme.spacings.small,
      paddingVertical:
        type === 'large' ? theme.spacings.medium : theme.spacings.xSmall,
      width: type === 'large' ? '100%' : undefined,
      alignSelf: 'flex-start',
    },
  }))();
