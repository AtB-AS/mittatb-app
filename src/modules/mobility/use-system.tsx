import {getTextForLanguage, useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {Platform} from 'react-native';
import {useThemeContext} from '@atb/theme';
import {useGetOperatorsQuery} from './queries/use-get-operators-query';
import {getOperatorNameById} from '@atb/api/utils';
import {LocalizedString, System} from '@atb/api/types/mobility';
import {SystemFragment} from '@atb/api/types/generated/fragments/mobility-shared';

export const useSystem = <T extends {system: SystemFragment | System}>(
  entity: T | undefined | null,
  operator: LocalizedString | undefined = entity?.system.name,
) => {
  const {t, language} = useTranslation();
  const {themeName} = useThemeContext();
  const operatorId = entity?.system.operator.id;
  const {data: operators} = useGetOperatorsQuery();
  const operatorNameFromQuery = getOperatorNameById(
    operators,
    operatorId,
    language,
  );

  const appStoreUri =
    Platform.OS === 'ios'
      ? entity?.system.rentalApps?.ios?.storeUri
      : entity?.system.rentalApps?.android?.storeUri;

  const brandLogoUrl =
    themeName === 'dark'
      ? entity?.system.brandAssets?.brandImageUrlDark
      : entity?.system.brandAssets?.brandImageUrl;

  const operatorNameFallback =
    getTextForLanguage(operator?.translation, language) ??
    t(MobilityTexts.unknownOperator) ??
    '';

  return {
    appStoreUri,
    brandLogoUrl,
    operatorId,
    operatorName: operatorNameFromQuery ?? operatorNameFallback,
  };
};
