import {ViewStyle} from 'react-native';
import {Theme, useThemeContext} from '@atb/theme';
import {ContainerSizingType, RadiusModeType} from './types';

export type BaseSectionItemProps = {
  transparent?: boolean;
  type?: ContainerSizingType;
  radius?: RadiusModeType;
  radiusSize?: keyof Theme['border']['radius'];
  testID?: string;
};

export type SectionReturnType = {
  topContainer: ViewStyle;
  contentContainer: ViewStyle;
};

export function useSectionItem({
  transparent = false,
  type = 'block',
  radius,
  radiusSize,
}: BaseSectionItemProps): SectionReturnType {
  const {theme} = useThemeContext();

  const topContainer: ViewStyle = {
    ...mapToPadding(theme, type),
    ...mapToBorderRadius(theme, radiusSize, radius),
    backgroundColor: transparent
      ? undefined
      : theme.color.background.neutral[0].background,
  };
  const contentContainer: ViewStyle = {
    flex: 1,
  };

  return {
    topContainer,
    contentContainer,
  };
}

type Padding = Pick<ViewStyle, 'paddingVertical' | 'paddingHorizontal'>;

function mapToPadding(theme: Theme, type: ContainerSizingType): Padding {
  switch (type) {
    case 'block':
      return {
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.medium,
      };
    case 'spacious':
      return {
        paddingVertical: theme.spacing.large,
        paddingHorizontal: theme.spacing.medium,
      };
  }
}

type BorderRadius = Pick<
  ViewStyle,
  | 'borderTopLeftRadius'
  | 'borderTopRightRadius'
  | 'borderBottomRightRadius'
  | 'borderBottomLeftRadius'
>;

function mapToBorderRadius(
  theme: Theme,
  radiusSize: keyof Theme['border']['radius'] = 'regular',
  radius?: RadiusModeType,
): BorderRadius {
  if (!radius) {
    return {};
  }
  const size = theme.border.radius[radiusSize];
  const top: ViewStyle = {
    borderTopLeftRadius: size,
    borderTopRightRadius: size,
  };
  const bottom: ViewStyle = {
    borderBottomLeftRadius: size,
    borderBottomRightRadius: size,
  };

  switch (radius) {
    case 'bottom':
      return bottom;
    case 'top':
      return top;
    default:
      return {...top, ...bottom};
  }
}
