import {
  SystemFragment,
  TranslatedStringFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {Platform} from 'react-native';
import {useTheme} from '@atb/theme';

export const useSystem = <T extends {system: SystemFragment}>(
  entity: T | undefined,
  operator: TranslatedStringFragment | undefined = entity?.system.name,
) => {
  const {t, language} = useTranslation();
  const {themeName} = useTheme();

  const appStoreUri =
    Platform.OS === 'ios'
      ? entity?.system.rentalApps?.ios?.storeUri
      : entity?.system.rentalApps?.android?.storeUri;

  const brandLogoUrl =
    themeName === 'dark'
      ? entity?.system.brandAssets?.brandImageUrlDark
      : entity?.system.brandAssets?.brandImageUrl;

  const operatorName =
    getTextForLanguage(operator?.translation, language) ??
    t(MobilityTexts.unknownOperator) ??
    '';

  const operatorId = entity?.system.operator.id;

  return {
    appStoreUri,
    brandLogoUrl,
    operatorId,
    operatorName,
  };
};
