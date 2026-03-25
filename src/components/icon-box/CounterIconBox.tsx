import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {TextNames} from '@atb/theme/colors';
import {useFontScale} from '@atb/utils/use-font-scale';
import {getIconBoxBorderRadius} from './utils';
import {SvgProps} from 'react-native-svg';
import {WithNotificationBadge} from './WithNotificationBadge';

const getTransportColor = (theme: Theme) => theme.color.transport.other;

export const CounterIconBox = ({
  count,
  textType,
  size = 'normal',
  spacing = 'compact',
  style,
  notification,
}: {
  count: number;
  textType: TextNames;
  size?: keyof Theme['icon']['size'];
  spacing?: 'compact' | 'standard';
  style?: StyleProp<ViewStyle>;
  notification?: (props: SvgProps) => React.JSX.Element;
}) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const fontScale = useFontScale();
  const lineHeight = theme.icon.size[size];

  if (count < 1) return null;

  return (
    <WithNotificationBadge notification={notification}>
      {({extraPaddingRight}) => {
        const basePadding =
          spacing === 'compact' ? theme.spacing.xSmall : theme.spacing.small;
        return (
          <View
            style={[
              styles.counterContainer,
              style,
              {
                padding: basePadding,
                paddingRight: basePadding + extraPaddingRight,
                borderRadius: getIconBoxBorderRadius(size, theme),
              },
            ]}
            importantForAccessibility="no-hide-descendants"
          >
          <ThemeText
            color={getTransportColor(theme).secondary}
            typography={textType}
            testID="tripLegMore"
            style={{
              height: lineHeight * fontScale,
              minWidth: lineHeight * fontScale,
              lineHeight: lineHeight,
              textAlign: 'center',
            }}
          >
            +{count}
          </ThemeText>
        </View>
        );
      }}
    </WithNotificationBadge>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  counterContainer: {
    backgroundColor: getTransportColor(theme).primary.background,
  },
}));
