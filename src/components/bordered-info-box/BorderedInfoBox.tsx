import {getStaticColor, StaticColor} from '@atb/theme/colors';
import {ThemeText} from '@atb/components/text';
import {StyleProp, View, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {StyleSheet} from '@atb/theme';
import {addOpacity} from '@atb/utils/add-opacity';

export type BorderedInfoBoxProps =
  | {
      backgroundColor: StaticColor;
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
}: BorderedInfoBoxProps) => {
  const styles = useStyles(type, backgroundColor);
  return (
    <View style={[styles.container, style]}>
      {'text' in props ? (
        <ThemeText type="body__tertiary" color={backgroundColor}>
          {props.text}
        </ThemeText>
      ) : (
        props.children
      )}
    </View>
  );
};

const useStyles = (
  type: BorderedInfoBoxProps['type'],
  backgroundColor: BorderedInfoBoxProps['backgroundColor'],
) =>
  StyleSheet.createThemeHook((theme, themeName) => ({
    container: {
      borderColor: addOpacity(
        getStaticColor(themeName, backgroundColor).text,
        0.1,
      ),
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
