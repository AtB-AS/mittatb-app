import {ViewStyle} from 'react-native';
import {Theme, useThemeContext} from '@atb/theme';
import {ContainerSizingType, RadiusModeType} from './types';

export type BaseSectionItemProps = {
  transparent?: boolean;
  type?: ContainerSizingType;
  radius?: RadiusModeType;
  radiusSize?: keyof Theme['border']['radius'];
  testID?: string;
  active?: boolean;
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
  active,
}: BaseSectionItemProps): SectionReturnType {
  const {theme} = useThemeContext();
  const {neutral, accent} = theme.color.surface;

  const topContainer: ViewStyle = {
    ...mapToPadding(theme, type),
    ...mapToBorderRadius(theme, radiusSize, radius),
    backgroundColor: transparent
      ? undefined
      : active
        ? accent.subtle.background
        : neutral.strong.background,
    borderColor: active
      ? accent.strong.background
      : transparent
        ? 'transparent'
        : neutral.strong.background,
    borderWidth: theme.border.width.slim,
  };
  const contentContainer: ViewStyle = {
    flex: 1,
  };

  return {
    topContainer,
    contentContainer,
  };
}

type Padding = Pick<
  ViewStyle,
  'padding' | 'paddingVertical' | 'paddingHorizontal'
>;

function mapToPadding(theme: Theme, type: ContainerSizingType): Padding {
  switch (type) {
    case 'block':
      return {
        padding: theme.spacing.medium - theme.border.width.slim,
      };
    case 'spacious':
      return {
        padding: theme.spacing.large - theme.border.width.slim,
      };
    case 'slim':
      return {
        paddingVertical: theme.spacing.xSmall,
        paddingHorizontal: theme.spacing.medium - theme.border.width.slim,
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
