import {SelectTravelTokenScreenComponent} from '@atb/select-travel-token-screen';
import {MobileTokenWithoutTravelcardOnboardingScreenProps} from '@atb/stacks-hierarchy/Root_MobileTokenWithoutTravelcardOnboarding/navigation_types';

type Props =
  MobileTokenWithoutTravelcardOnboardingScreenProps<'MobileTokenWithoutTravelcardOnboarding_SelectTravelTokenScreen'>;

export const MobileTokenWithoutTravelcardOnboarding_SelectTravelTokenScreen = ({
  navigation,
}: Props) => (
  <SelectTravelTokenScreenComponent onAfterSave={navigation.goBack} />
);
