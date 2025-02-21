import {ViewStyle} from 'react-native';
import {
  ContrastColor,
  InteractiveColor,
  Theme,
  useThemeContext,
} from '@atb/theme';
import {ContainerSizingType, RadiusModeType} from './types';

export type BaseSectionItemProps = {
  transparent?: boolean;
  type?: ContainerSizingType;
  radius?: RadiusModeType;
  radiusSize?: keyof Theme['border']['radius'];
  testID?: string;
  active?: boolean;
  interactiveColor?: InteractiveColor;
};

export type SectionReturnType = {
  topContainer: ViewStyle;
  contentContainer: ViewStyle;
  interactiveColor: InteractiveColor<ContrastColor>;
};

const getInteractiveColor = (theme: Theme) => theme.color.interactive[2];

export function useSectionItem({
  transparent = false,
  type = 'block',
  radius,
  radiusSize,
  active,
  interactiveColor: customInteractiveColor,
}: BaseSectionItemProps): SectionReturnType {
  const {theme} = useThemeContext();
  const interactiveColor = customInteractiveColor ?? getInteractiveColor(theme);

  const topContainer: ViewStyle = {
    ...mapToPadding(theme, type),
    ...mapToBorderRadius(theme, radiusSize, radius),
    backgroundColor: transparent
      ? undefined
      : interactiveColor[active ? 'active' : 'default'].background,
    borderColor: interactiveColor[active ? 'outline' : 'default'].background,
    borderWidth: theme.border.width.slim,
  };
  const contentContainer: ViewStyle = {
    flex: 1,
  };

  return {
    topContainer,
    contentContainer,
    interactiveColor,
  };
}

type Padding = Pick<ViewStyle, 'paddingVertical' | 'paddingHorizontal'>;

function mapToPadding(theme: Theme, type: ContainerSizingType): Padding {
  switch (type) {
    case 'block':
      return {
        paddingVertical: theme.spacing.medium - theme.border.width.slim,
        paddingHorizontal: theme.spacing.medium - theme.border.width.slim,
      };
    case 'spacious':
      return {
        paddingVertical: theme.spacing.large - theme.border.width.slim,
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
