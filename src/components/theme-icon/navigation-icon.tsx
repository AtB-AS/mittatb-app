import React from 'react';
import ThemeIcon from '.';
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
} from '../../assets/svg/icons/navigation';

export type NavigationIconTypes =
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-upleft'
  | 'chevron-left'
  | 'chevron-right'
  | 'expand-less'
  | 'expand-more'
  | 'unfold-less'
  | 'unfold-more';

type NavigationIconProps = {
  mode?: NavigationIconTypes;
};
export default function NavigationIcon({
  mode = 'arrow-right',
}: NavigationIconProps) {
  return <ThemeIcon svg={mapMode(mode)} />;
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
