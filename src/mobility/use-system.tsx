import {
  SystemFragment,
  TranslatedStringFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';
import {useEffect, useState} from 'react';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {Appearance, Platform} from 'react-native';

export const useSystem = <T extends {system: SystemFragment}>(
  entity: T,
  operator: TranslatedStringFragment = entity.system.name,
) => {
  const {t, language} = useTranslation();
  const [appStoreUri, setAppStoreUri] = useState<string>();
  const [brandLogoUrl, setBrandLogoUrl] = useState<string>();
  const [operatorName, setOperatorName] = useState('');

  useEffect(() => {
    setAppStoreUri(
      Platform.OS === 'ios'
        ? entity.system.rentalApps?.ios?.storeUri
        : entity.system.rentalApps?.android?.storeUri,
    );
    setBrandLogoUrl(
      Appearance.getColorScheme() === 'dark'
        ? entity.system.brandAssets?.brandImageUrlDark
        : entity.system.brandAssets?.brandImageUrl,
    );
    setOperatorName(
      getTextForLanguage(operator.translation, language) ??
        t(MobilityTexts.unknownOperator) ??
        '',
    );
  }, [entity]);

  return {
    appStoreUri,
    brandLogoUrl,
    operatorName,
  };
};
