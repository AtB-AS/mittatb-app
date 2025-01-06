import {ThemeText} from '@atb/components/text';
import {StyleProp, View, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {StyleSheet} from '@atb/theme';
import {ContrastColor} from '@atb/theme/colors';

export type BorderedInfoBoxProps =
  | {
      /** The background color of the component where this box is placed */
      backgroundColor: ContrastColor;
      type: 'large' | 'small';
      style?: StyleProp<ViewStyle>;
      testID?: string;
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
  testID,
  ...props
}: BorderedInfoBoxProps) => {
  const styles = useStyles(type);
  return (
    <View style={[styles.container, style]}>
      {'text' in props ? (
        <ThemeText
          typography="body__tertiary"
          color={backgroundColor}
          testID={testID}
        >
          {props.text}
        </ThemeText>
      ) : (
        props.children
      )}
    </View>
  );
};

const useStyles = (type: BorderedInfoBoxProps['type']) => {
  return StyleSheet.createThemeHook((theme) => ({
    container: {
      borderColor: theme.color.background.neutral[2].background,
      borderWidth: theme.border.width.slim,
      borderRadius: theme.border.radius.regular,
      paddingHorizontal:
        type === 'large' ? theme.spacing.medium : theme.spacing.small,
      paddingVertical:
        type === 'large' ? theme.spacing.medium : theme.spacing.xSmall,
      width: type === 'large' ? '100%' : undefined,
      alignSelf: 'flex-start',
    },
  }))();
};
