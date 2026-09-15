import React from 'react';
import {View} from 'react-native';
import type {StyleProp, ViewProps, ViewStyle} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import type {IconColor, ThemeIconProps} from '@atb/components/theme-icon';
import type {ContrastColor, Theme} from '@atb/theme/colors';
import {
  DECORATION_AXIS,
  DimensionOverrides,
  NEW_TRIP_DIMENSIONS,
  TripRow,
} from './TripRow';

const useIconWidth = (boxed: boolean) => {
  const {theme} = useThemeContext();
  return boxed
    ? theme.icon.size.small + theme.spacing.small * 2
    : theme.icon.size.large;
};

const defaultBoxColor = (theme: Theme) => theme.color.transport.walk.primary;

type TripIconRowProps = {
  svg: ThemeIconProps['svg'];
  color?: IconColor;
  boxed?: boolean;
  boxColor?: ContrastColor;
  iconAccessibilityLabel?: string;
  decorated?: boolean; // whether there's a tripLegDecoration to the left of this icon
  contentStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
} & Pick<ViewProps, 'accessible' | 'accessibilityLabel' | 'testID'>;

/** A trip row led by an icon, with spacing.small across to the content. */
export const TripIconRow = ({
  svg,
  color,
  boxed = false,
  boxColor,
  iconAccessibilityLabel,
  decorated = false,
  contentStyle,
  children,
  ...rowProps
}: TripIconRowProps) => {
  const style = useStyles();
  const {theme} = useThemeContext();
  const iconWidth = useIconWidth(boxed);

  const dimensionOverrides: DimensionOverrides = decorated
    ? NEW_TRIP_DIMENSIONS
    : {
        ...NEW_TRIP_DIMENSIONS,
        labelWidth: DECORATION_AXIS - iconWidth / 2,
        decorationContainerWidth: 0,
      };

  const icon = (
    <ThemeIcon
      svg={svg}
      size={boxed ? 'small' : 'large'}
      color={color}
      accessibilityLabel={iconAccessibilityLabel}
    />
  );

  return (
    <TripRow dimensionOverrides={dimensionOverrides} {...rowProps}>
      <View style={style.row}>
        {boxed ? (
          <View
            style={[
              style.box,
              {
                backgroundColor: (boxColor ?? defaultBoxColor(theme))
                  .background,
              },
            ]}
          >
            {icon}
          </View>
        ) : (
          icon
        )}
        <View style={[style.content, contentStyle]}>{children}</View>
      </View>
    </TripRow>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  box: {
    padding: theme.spacing.small,
    borderRadius: theme.border.radius.regular,
  },
  content: {
    flex: 1,
  },
}));
