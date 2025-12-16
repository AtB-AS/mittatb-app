import {useTranslation} from '@atb/translations';
import type {ContrastColor} from '@atb-as/theme';
import {
  findReferenceDataById,
  getReferenceDataName,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {TravelRightDirection} from '@atb-as/utils';
import {FromToBox} from './FromToBox';
import dictionary from '@atb/translations/dictionary';
import {Size} from '../utils';

type ZonesFromToProps = {
  fareZoneRefs: string[];
  size: Size;
  backgroundColor: ContrastColor;
};

export const ZonesFromTo = ({
  fareZoneRefs,
  size,
  backgroundColor,
}: ZonesFromToProps) => {
  const {t} = useTranslation();
  const controllerData = useZonesFromToController({
    fareZoneRefs,
  });
  if (!controllerData) return null;
  const {fromZoneName, toZoneName} = controllerData;

  const fromZoneText = `${t(dictionary.zone)} ${fromZoneName}`;
  const toZoneText = toZoneName
    ? `${t(dictionary.zone)} ${toZoneName}`
    : undefined;

  return (
    <FromToBox
      fromText={fromZoneText}
      toText={toZoneText}
      direction={TravelRightDirection.Both}
      size={size}
      backgroundColor={backgroundColor}
    />
  );
};

type ZonesFromToControllerProps = {fareZoneRefs: string[]};

function useZonesFromToController({fareZoneRefs}: ZonesFromToControllerProps) {
  const {fareZones} = useFirestoreConfigurationContext();
  const {language} = useTranslation();

  const fromZoneId = fareZoneRefs[0];
  const fromZone = findReferenceDataById(fareZones, fromZoneId);
  if (!fromZone) return undefined;

  const fromZoneName = getReferenceDataName(fromZone, language);

  const toZoneId = fareZoneRefs[fareZoneRefs.length - 1];
  const toZone =
    fromZoneId !== toZoneId
      ? findReferenceDataById(fareZones, toZoneId)
      : undefined;
  const toZoneName = toZone
    ? getReferenceDataName(toZone, language)
    : undefined;

  return {
    fromZoneName,
    toZoneName,
  };
}
