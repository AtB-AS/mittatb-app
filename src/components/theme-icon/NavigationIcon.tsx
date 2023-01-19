import React from 'react';
import {ThemeIcon} from './ThemeIcon';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  UnfoldLess,
  UnfoldMore,
} from '@atb/assets/svg/mono-icons/navigation';
import {SvgProps} from 'react-native-svg';

const navigationTypes = [
  'arrow-left',
  'arrow-right',
  'arrow-upleft',
  'chevron-left',
  'chevron-right',
  'expand-less',
  'expand-more',
  'unfold-less',
  'unfold-more',
] as const;

export type NavigationIconTypes = (typeof navigationTypes)[number];

type NavigationIconProps = {
  mode?: NavigationIconTypes;
} & SvgProps;
export function NavigationIcon({
  mode = 'arrow-right',
  ...props
}: NavigationIconProps) {
  return <ThemeIcon svg={mapMode(mode)} {...props} />;
}

export function isNavigationIcon(a: any): a is NavigationIconTypes {
  return navigationTypes.includes(a);
}

function mapMode(mode: NavigationIconTypes) {
  switch (mode) {
    case 'arrow-left':
      return ArrowLeft;
    case 'arrow-right':
      return ArrowRight;
    case 'arrow-upleft':
      return ArrowUpLeft;
    case 'chevron-left':
      return ChevronLeft;
    case 'chevron-right':
      return ChevronRight;
    case 'expand-less':
      return ExpandLess;
    case 'expand-more':
      return ExpandMore;
    case 'unfold-less':
      return UnfoldLess;
    case 'unfold-more':
      return UnfoldMore;
    default:
      return ArrowRight;
  }
}
