import {
  getTextForLanguage,
  Language,
  TicketTravellerTexts,
} from '@atb/translations';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {TFunc} from '@leile/lobo-t';

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
