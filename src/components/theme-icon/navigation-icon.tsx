import React from 'react';
import ThemeIcon from './theme-icon';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ChevronLeft,
  ChevronRight,
  Expand,
  ExpandLess,
  UnfoldLess,
  UnfoldMore,
} from '@atb/assets/svg/icons/navigation';

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

export type NavigationIconTypes = typeof navigationTypes[number];

type NavigationIconProps = {
  mode?: NavigationIconTypes;
};
export default function NavigationIcon({
  mode = 'arrow-right',
}: NavigationIconProps) {
  return <ThemeIcon svg={mapMode(mode)} />;
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
      return Expand;
    case 'unfold-less':
      return UnfoldLess;
    case 'unfold-more':
      return UnfoldMore;
    default:
      return ArrowRight;
  }
}
