import React from 'react';
import {ActivityIndicator, Linking, View, ViewStyle} from 'react-native';
import {OperatorBenefitType} from '@atb/configuration';
import {getTextForLanguage} from '@atb/translations/utils';
import {useTranslation} from '@atb/translations';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useBenefits} from '@atb/mobility/use-benefits';
import {constructBenefitAppUrl, getRentalAppUri} from '@atb/mobility/utils';
import {
  RentalUrisFragment,
  SystemFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';
import {useSystem} from '@atb/mobility/use-system';
import {useValueCodeQuery} from '@atb/mobility/use-value-code-query';
import {StyleSheet} from '@atb/theme';
import {SvgXml} from 'react-native-svg';

type Props<T> = {
  entity: T;
  style?: ViewStyle;
};

export function OperatorBenefits<
  T extends {system: SystemFragment; rentalUris?: RentalUrisFragment},
>({entity, style}: Props<T>) {
  const {operatorId, operatorName, appStoreUri} = useSystem(entity);
  const {userBenefits, operatorBenefits, isLoading} = useBenefits(operatorId);

  if (!operatorId) {
    return null;
  }

  if (isLoading) {
    return (
      <View style={style}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLoading && operatorBenefits.length === 0) {
    return null;
  }

  return (
    <View style={style}>
      {operatorBenefits.map((benefit) => (
        <OperatorBenefit
          key={benefit.id}
          benefit={benefit}
          isUserEligible={true}
          operatorId={operatorId}
          operatorName={operatorName}
          rentalAppUri={getRentalAppUri(entity)}
          appStoreUri={appStoreUri}
        />
      ))}
    </View>
  );
}

type OperatorBenefitProps = {
  benefit: OperatorBenefitType;
  isUserEligible: boolean;
  operatorId: string;
  operatorName: string;
  appStoreUri: string | undefined;
  rentalAppUri: string | undefined;
  style?: ViewStyle;
};
const OperatorBenefit = ({
  isUserEligible,
  benefit,
  operatorId,
  operatorName,
  appStoreUri,
  rentalAppUri,
}: OperatorBenefitProps) => {
  const {language, t} = useTranslation();
  const {data: valueCode} = useValueCodeQuery(operatorId);
  const style = useStyles();

  const heading = getTextForLanguage(
    isUserEligible ? benefit.headingWhenActive : benefit.headingWhenNotActive,
    language,
  );
  const text =
    getTextForLanguage(
      isUserEligible
        ? benefit.descriptionWhenActive
        : benefit.descriptionWhenNotActive,
      language,
    ) ?? '';

  let callToActionText = getTextForLanguage(
    benefit.callToAction.name,
    language,
  );
  if (!callToActionText || !isUserEligible) {
    callToActionText = t(MobilityTexts.operatorAppSwitchButton(operatorName));
  }

  const handleCallToAction = async () => {
    let benefitUrl = benefit.callToAction.url;
    if (rentalAppUri && benefitUrl.includes('{APP_URL}')) {
      benefitUrl = constructBenefitAppUrl({
        benefitUrl,
        rentalAppUri,
      });
    }
    benefitUrl = insertValueCode(benefitUrl, valueCode);
    await Linking.openURL(benefitUrl);
  };

  return (
    <Section>
      <GenericSectionItem>
        <View style={style.benefitContainer}>
          <View style={style.benefitImage}>
            {isUserEligible && benefit.imageWhenActive && (
              <SvgXml xml={benefit.imageWhenActive} />
            )}
            {!isUserEligible && benefit.imageWhenNotActive && (
              <SvgXml xml={benefit.imageWhenNotActive} />
            )}
          </View>
          <View style={style.benefitContent}>
            <ThemeText type="body__primary--bold">{heading}</ThemeText>
            <ThemeText>{text}</ThemeText>
          </View>
        </View>
      </GenericSectionItem>
      {isUserEligible && benefit.callToAction && (
        <LinkSectionItem
          text={callToActionText}
          textType="body__secondary"
          onPress={handleCallToAction}
        />
      )}
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  benefitContainer: {
    flexDirection: 'row',
  },
  benefitImage: {
    marginRight: theme.spacings.medium,
  },
  benefitContent: {
    flex: 1,
  },
}));

const insertValueCode = (url: string, valueCode: string | null | undefined) => {
  if (!valueCode) return url;
  return url.replace(/\{(.*?)}/g, valueCode);
};
