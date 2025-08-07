import React from 'react';
import {ThemeIcon, ThemeIconProps} from './ThemeIcon';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  ExternalLink,
  UnfoldLess,
  UnfoldMore,
} from '@atb/assets/svg/mono-icons/navigation';

const navigationTypes = [
  'arrow-left',
  'arrow-right',
  'arrow-upleft',
  'chevron-left',
  'chevron-right',
  'expand-less',
  'expand-more',
  'external-link',
  'unfold-less',
  'unfold-more',
] as const;

export type NavigationIconTypes = (typeof navigationTypes)[number];

type NavigationIconProps = {
  mode?: NavigationIconTypes;
} & Omit<ThemeIconProps, 'svg'>;
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
    case 'external-link':
      return ExternalLink;
    case 'unfold-less':
      return UnfoldLess;
    case 'unfold-more':
      return UnfoldMore;
    default:
      return ArrowRight;
  }
}
