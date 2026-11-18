import {
  BaggageProduct,
  FareProductTypeConfig,
  FareZone,
  UserProfile,
} from '@atb-as/config-specs';
import {UniqueWithCount} from '@atb/utils/unique-with-count';
import {getReferenceDataName} from '../configuration';
import {TravelRightDirection} from '@atb-as/utils';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {useStopPlacesByModeQuery} from '@atb/queries/use-stop-places-by-mode-query';
import {getTransportModeText} from '@atb/components/transportation-modes';
import {getTravellersText} from './utils';
import {screenReaderPause} from '@atb/components/text';

export function useTicketAccessibilityLabel(
  fareProductTypeConfig: FareProductTypeConfig | undefined,
  userProfilesWithCount: UniqueWithCount<UserProfile>[],
  baggageProductsWithCount: UniqueWithCount<BaggageProduct>[],
  fareZones: FareZone[],
  fromTo: {fromId: string; toId: string} | undefined,
  direction: TravelRightDirection | undefined,
): string {
  const {t, language} = useTranslation();

  const harborsQuery = useStopPlacesByModeQuery(
    fareProductTypeConfig?.transportModes,
    !!fromTo,
  );

  const travellersText = getTravellersText(
    userProfilesWithCount,
    baggageProductsWithCount,
    language,
  );

  const transportModes = fareProductTypeConfig?.transportModes ?? [];

  const modeInfo = `${t(
    FareContractTexts.a11yTicketInfoLabels.transportModes,
  )}${getTransportModeText(transportModes, t)}`;

  const travellerInfo = `${t(
    FareContractTexts.a11yTicketInfoLabels.travellers,
  )}${travellersText}`;

  const zoneNames = fareZones.map((fz) => getReferenceDataName(fz, language));
  const fromZoneName = zoneNames[0];
  const toZoneName = zoneNames[zoneNames.length - 1];

  if (fareProductTypeConfig?.configuration.zoneSelectionMode === 'none') {
    return `${modeInfo}. ${screenReaderPause} ${travellerInfo}. ${screenReaderPause}`;
  }
  const zoneInfo =
    fromZoneName === toZoneName
      ? `${t(
          FareContractTexts.a11yTicketInfoLabels.zones.oneZone,
        )} ${fromZoneName}`
      : `${t(
          FareContractTexts.a11yTicketInfoLabels.zones.multipleZones,
        )} ${fromZoneName}, ${toZoneName}`;

  const harborInfo = () => {
    if (fromTo && direction) {
      const fromName =
        harborsQuery.data?.find((sp) => sp.id === fromTo.fromId)?.name ?? '';
      const toName =
        harborsQuery.data?.find((sp) => sp.id === fromTo.toId)?.name ?? '';
      return direction === TravelRightDirection.Both
        ? t(
            FareContractTexts.a11yTicketInfoLabels.harbors.returnTrip(
              fromName,
              toName,
            ),
          )
        : t(
            FareContractTexts.a11yTicketInfoLabels.harbors.oneWayTrip(
              fromName,
              toName,
            ),
          );
    }
    return '';
  };
  const zoneOrHarborInfo = fareZones.length > 0 ? zoneInfo : harborInfo();

  return `${modeInfo}. ${screenReaderPause} 
          ${travellerInfo}. ${screenReaderPause} 
          ${zoneOrHarborInfo}. ${screenReaderPause}`;
}
