import {
  BaggageProduct,
  FareProductTypeConfig,
  FareZone,
  PreassignedFareProduct,
  UserProfile,
} from '@atb-as/config-specs';
import {UniqueWithCount} from '@atb/utils/unique-with-count';
import {getReferenceDataName} from '../configuration';
import {TravelRightDirection} from '@atb-as/utils';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {useHarborsQuery} from '@atb/queries/use-harbors-query';
import {getTransportModeText} from '@atb/components/transportation-modes';
import {getTravellersText} from './utils';
import {screenReaderPause} from '@atb/components/text';

export function useTicketAccessibilityLabel(
  preassignedFareProduct: PreassignedFareProduct,
  fareProductTypeConfig: FareProductTypeConfig | undefined,
  userProfilesWithCount: UniqueWithCount<UserProfile>[],
  baggageProductsWithCount: UniqueWithCount<BaggageProduct>[],
  fareZones: FareZone[],
  fromPlace: string | undefined,
  toPlace: string | undefined,
  direction: TravelRightDirection | undefined,
): string {
  const {t, language} = useTranslation();

  const harborsQuery = useHarborsQuery(fareProductTypeConfig?.transportModes);

  const productName = getReferenceDataName(preassignedFareProduct, language);

  const travellersText = getTravellersText(
    userProfilesWithCount,
    baggageProductsWithCount,
    language,
  );

  const transportModes = fareProductTypeConfig?.transportModes ?? [];

  const modeInfo = `${productName} ${screenReaderPause} ${t(
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
    if (fromPlace && toPlace && direction) {
      const fromName =
        harborsQuery.data?.find((sp) => sp.id === fromPlace)?.name ?? '';
      const toName =
        harborsQuery.data?.find((sp) => sp.id === toPlace)?.name ?? '';
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
