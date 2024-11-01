import {ViewStyle} from 'react-native';
import {Theme, useTheme} from '@atb/theme';
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
  spacing: number;
};

export function useSectionItem({
  transparent = false,
  type = 'block',
  radius,
  radiusSize,
}: BaseSectionItemProps): SectionReturnType {
  const {theme} = useTheme();

  const spacing = useSpacing(type);

  const topContainer: ViewStyle = {
    padding: spacing,
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
    spacing,
  };
}

function useSpacing(type: ContainerSizingType) {
  const {theme} = useTheme();
  switch (type) {
    case 'block':
      return theme.spacing.medium;
    case 'spacious':
      return theme.spacing.large;
  }
}

function mapToBorderRadius(
  theme: Theme,
  radiusSize: keyof Theme['border']['radius'] = 'regular',
  radius?: RadiusModeType,
): ViewStyle {
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
