import {StyleProp, View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {InteractiveColor} from '@atb/theme/colors';

type Props = {
  text: string;
  interactiveColor: InteractiveColor;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * An info chip, styled with the active color from the interactive color of the
 * component it is places.
 */
export const InfoChip = ({
  text,
  interactiveColor,
  style = {},
  testID = '',
}: Props) => {
  const styles = useStyles();
  const {theme} = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.interactive[interactiveColor].active.background,
        },
        style,
      ]}
    >
      <ThemeText
        type="body__tertiary"
        color={theme.interactive[interactiveColor].active}
        testID={testID}
      >
        {text}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
    paddingVertical: theme.spacings.xSmall,
    borderRadius: theme.border.radius.regular,
  },
}));
