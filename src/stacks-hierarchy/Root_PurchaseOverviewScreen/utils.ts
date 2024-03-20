import {TravellerSelectionMode} from '@atb-as/config-specs';
import {UserProfile} from '@atb/configuration';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {
  getTextForLanguage,
  Language,
  TicketTravellerTexts,
} from '@atb/translations';
import {TFunc} from '@leile/lobo-t';

export const isUserProfileSelectable = (
  travellerSelectionMode: TravellerSelectionMode,
  selectableTravellers: UserProfile[],
) =>
  !(
    travellerSelectionMode === `none` ||
    (travellerSelectionMode === `single` && selectableTravellers.length <= 1)
  );

export const getTravellerInfoByFareProductType = (
  fareProductType: string | undefined,
  userProfile: UserProfileWithCount,
  language: Language,
  t: TFunc<typeof Language>,
) => {
  const genericUserProfileDescription = getTextForLanguage(
    userProfile.alternativeDescriptions,
    language,
  );

  return [
    t(
      TicketTravellerTexts.userProfileDescriptionOverride(
        userProfile.userTypeString,
        fareProductType,
      ),
    ) || genericUserProfileDescription,
    t(
      TicketTravellerTexts.information(
        userProfile.userTypeString,
        fareProductType,
      ),
    ),
  ].join(' ');
};
