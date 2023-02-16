import {SelectTravelTokenScreenComponent} from '@atb/select-travel-token-screen';
import {MobileTokenOnboardingScreenProps} from '@atb/stacks-hierarchy/Root_MobileTokenOnboarding/navigation_types';

type Props =
  MobileTokenOnboardingScreenProps<'MobileTokenOnboarding_SelectTravelTokenScreen'>;

export const MobileTokenOnboarding_SelectTravelTokenScreen = ({
  navigation,
}: Props) => (
  <SelectTravelTokenScreenComponent onAfterSave={navigation.goBack} />
);
