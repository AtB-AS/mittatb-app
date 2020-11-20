import {ImageStyle, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {Theme, useTheme} from '../../../theme';
import {RadiusSizes} from '../../../theme/colors';

export type ContainerSizingType = 'inline' | 'compact' | 'block';
export type RadiusMode = 'top' | 'bottom' | 'top-bottom';

export type SectionItemProps = {
  type?: ContainerSizingType;
  radius?: RadiusMode;
  radiusSize?: RadiusSizes;
};
export type SectionItem<T> = T & SectionItemProps;

export type SectionReturnType = {
  topContainer: ViewStyle;
  contentContainer: ViewStyle;
};

export default function useSectionItem({
  type = 'block',
  radius,
  radiusSize,
}: SectionItemProps): SectionReturnType {
  const {theme} = useTheme();
  const isInline = type === 'compact' || type === 'inline';

  const spacing =
    type === 'compact' ? theme.spacings.small : theme.spacings.medium;

  const topContainer: ViewStyle = {
    padding: spacing,
    alignSelf: isInline ? 'flex-start' : undefined,
    ...mapToBorderRadius(theme, radiusSize, radius),
  };
  const contentContainer: ViewStyle = {
    flex: isInline ? undefined : 1,
  };

  return {
    topContainer,
    contentContainer,
  };
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
