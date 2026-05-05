export {TravelCard, type TravelCardType} from './TravelCard';
export {type TravelCardHeaderSize} from './TravelCardHeader';
import {withCompositeAccessibility} from '@atb/modules/composite-accessibility';
import {TravelCardHeader as TravelCardHeaderComponent} from './TravelCardHeader';

export {TravelCardHeaderComponent};

export const TravelCardHeader = withCompositeAccessibility(
  TravelCardHeaderComponent,
  ['header'],
);
