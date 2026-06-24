export {TravelCard} from './TravelCard';
export {TravelCardSkeleton} from './TravelCardSkeleton';
export {WithTravelCardSkeleton} from './WithTravelCardSkeleton';
export {SkeletonBlock} from './SkeletonBlock';
export {getTripPatternStatus} from './utils';
export {type TravelCardHeaderSize} from './TravelCardHeader';
import {withCompositeAccessibility} from '@atb/modules/composite-accessibility';
import {TravelCardHeader as TravelCardHeaderComponent} from './TravelCardHeader';

export {TravelCardHeaderComponent};

export const TravelCardHeader = withCompositeAccessibility(
  TravelCardHeaderComponent,
  ['header'],
);
