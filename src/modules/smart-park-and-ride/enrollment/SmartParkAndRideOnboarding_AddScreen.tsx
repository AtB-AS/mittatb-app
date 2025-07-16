import {Root_SmartParkAndRideAddScreenComponent} from '@atb/screen-components/smart-park-and-ride';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';

type Props = RootStackScreenProps<'Root_SmartParkAndRideAddScreen'>;

export const SmartParkAndRideOnboarding_AddScreen = (props: Props) => (
  <Root_SmartParkAndRideAddScreenComponent {...props} />
);
