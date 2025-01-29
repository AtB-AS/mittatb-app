import {useTranslation} from '@atb/translations';
import type {ContrastColor} from '@atb-as/theme';
import {
  findReferenceDataById,
  getReferenceDataName,
  useFirestoreConfigurationContext,
} from '@atb/configuration';
import {TravelRightDirection} from '@atb/ticketing';
import {BorderedFromToBox} from '@atb/fare-contracts/components/BorderedFromToBox';
import dictionary from '@atb/translations/dictionary';

type ZonesFromToProps = {
  tariffZoneRefs: string[];
  mode: 'small' | 'large';
  backgroundColor: ContrastColor;
};

export const ZonesFromTo = ({
  tariffZoneRefs,
  mode,
  backgroundColor,
}: ZonesFromToProps) => {
  const {t} = useTranslation();
  const {fromZoneName, toZoneName} = useZonesFromToController({
    tariffZoneRefs,
  });
  if (!fromZoneName) return null;

  const fromZoneText = `${t(dictionary.zone)} ${fromZoneName}`;
  const toZoneText = toZoneName
    ? `${t(dictionary.zone)} ${toZoneName}`
    : undefined;

  return (
    <BorderedFromToBox
      fromText={fromZoneText}
      toText={toZoneText}
      direction={TravelRightDirection.Both}
      mode={mode}
      backgroundColor={backgroundColor}
    />
  );
};

type ZonesFromToControllerProps = {tariffZoneRefs: string[]};

function useZonesFromToController({
  tariffZoneRefs,
}: ZonesFromToControllerProps) {
  const {tariffZones} = useFirestoreConfigurationContext();
  const {language} = useTranslation();

  const fromZoneId = tariffZoneRefs[0];
  const fromZone = findReferenceDataById(tariffZones, fromZoneId);
  const fromZoneName = !!fromZone
    ? getReferenceDataName(fromZone, language)
    : undefined;

  const toZoneId = tariffZoneRefs[tariffZoneRefs.length - 1];
  const toZone =
    fromZoneId !== toZoneId
      ? findReferenceDataById(tariffZones, toZoneId)
      : undefined;
  const toZoneName = toZone
    ? getReferenceDataName(toZone, language)
    : undefined;

  return {
    fromZoneName,
    toZoneName,
  };
}
