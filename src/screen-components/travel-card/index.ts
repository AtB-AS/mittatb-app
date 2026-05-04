export {TravelCard} from './TravelCard';
import {withCompositeAccessibility} from '@atb/modules/composite-accessibility';
import {TravelCardHeader as TravelCardHeaderComponent} from './TravelCardHeader';

export const TravelCardHeader = withCompositeAccessibility(
  TravelCardHeaderComponent,
  ['header'],
);
