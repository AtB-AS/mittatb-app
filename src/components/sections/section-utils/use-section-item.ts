import {ViewStyle} from 'react-native';
import {Theme, useTheme} from '@atb/theme';
import {RadiusSizes} from '@atb/theme/colors';

export type ContainerSizingType = 'inline' | 'compact' | 'block' | 'spacious';
export type RadiusMode = 'top' | 'bottom' | 'top-bottom';

export type SectionItemProps = {
  transparent?: boolean;
  type?: ContainerSizingType;
  radius?: RadiusMode;
  radiusSize?: RadiusSizes;
  testID?: string;
};
export type SectionItem<T> = T & SectionItemProps;

export type SectionReturnType = {
  topContainer: ViewStyle;
  contentContainer: ViewStyle;
  spacing: number;
};

export default function useSectionItem({
  transparent = false,
  type = 'block',
  radius,
  radiusSize,
}: SectionItemProps): SectionReturnType {
  const {theme} = useTheme();
  const isInline = type === 'compact' || type === 'inline';

  const spacing = useSpacing(type);

  const topContainer: ViewStyle = {
    padding: spacing,
    alignSelf: isInline ? 'flex-start' : undefined,
    ...mapToBorderRadius(theme, radiusSize, radius),
    backgroundColor: transparent
      ? undefined
      : theme.static.background.background_0.background,
  };
  const contentContainer: ViewStyle = {
    flex: isInline ? undefined : 1,
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
    case 'compact':
      return theme.spacings.small;
    case 'inline':
    case 'block':
      return theme.spacings.medium;
    case 'spacious':
      return theme.spacings.large;
  }
}

function mapToBorderRadius(
  theme: Theme,
  radiusSize: RadiusSizes = 'regular',
  radius?: RadiusMode,
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
