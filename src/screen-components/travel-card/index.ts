export {TravelCard} from './TravelCard';
export {
  SkeletonBlock,
  TravelCardSkeleton,
  WithTravelCardSkeleton,
} from './skeleton';
export {getTripPatternStatus} from './utils';
export {type TravelCardHeaderSize} from './TravelCardHeader';
import {withCompositeAccessibility} from '@atb/modules/composite-accessibility';
import {TravelCardHeader as TravelCardHeaderComponent} from './TravelCardHeader';

export {TravelCardHeaderComponent};

export const TravelCardHeader = withCompositeAccessibility(
  TravelCardHeaderComponent,
  ['header'],
);
