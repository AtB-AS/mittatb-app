import {
  FareContractTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {FareProductTypeConfig} from '@atb/configuration';
import {TransportModePair} from '@atb/components/transportation-modes';
import {useTextForLanguage} from '@atb/translations/utils';

const modesDisplayLimit = 2;

export const useFareProductTitle = (config?: FareProductTypeConfig) => {
  const {t} = useTranslation();

  if (!config) {
    return undefined;
  }

  const transportModes = config.transportModes;

  const transportModesText = getFareProductTravelModesText(
    transportModes,
    t,
    modesDisplayLimit,
  );

  const title = useTextForLanguage(config.name) + ', ' + transportModesText;

  return title;
};

const getFareProductTravelModesText = (
  modes: TransportModePair[],
  t: TranslateFunction,
  modesDisplayLimit = 2,
): string => {
  const modesCount = modes.length;

  if (!modes) return '';
  if (modesCount > modesDisplayLimit) {
    return t(FareContractTexts.transportModes.multipleTravelModes);
  }

  const travelModes = modes
    .map((tm) => t(FareContractTexts.transportMode(tm.mode, tm.subMode)))
    .filter((value, index, array) => array.indexOf(value) === index); // remove duplicates

  if (travelModes.length < 2) {
    return travelModes[0] || '';
  } else {
    return (
      travelModes.splice(0, travelModes.length - 1).join(', ') +
      ` ${t(FareContractTexts.transportModes.concatListWord)} ` + // add " and " between the last two
      travelModes
    );
  }
};
