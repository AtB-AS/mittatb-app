import {getStaticColor, StaticColor} from '@atb/theme/colors';
import {ThemeText} from '@atb/components/text';
import {StyleProp, View, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {StyleSheet} from '@atb/theme';
import {addOpacity} from '@atb/utils/add-opacity';

type Props =
  | {
      backgroundColor: StaticColor;
      type: 'large' | 'small';
      style?: StyleProp<ViewStyle>;
    } & ({text: string} | {children: ReactNode});

export const BorderedInfoBox = ({
  type,
  backgroundColor,
  style,
  ...props
}: Props) => {
  const styles = useStyles(type, backgroundColor);
  return (
    <View style={[styles.container, style]}>
      {'text' in props ? (
        <ThemeText color={backgroundColor}>{props.text}</ThemeText>
      ) : (
        props.children
      )}
    </View>
  );
};

const useStyles = (
  type: Props['type'],
  backgroundColor: Props['backgroundColor'],
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
