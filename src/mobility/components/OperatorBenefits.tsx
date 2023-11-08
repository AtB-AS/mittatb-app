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
import {useOperatorApp} from '@atb/mobility/use-operator-app';
import {useBenefits} from '@atb/mobility/use-benefits';
import {getRentalAppUri, isUserEligibleForBenefit} from '@atb/mobility/utils';
import {
  RentalUrisFragment,
  SystemFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';
import {useSystem} from '@atb/mobility/use-system';
import {useValueCodeQuery} from '@atb/mobility/use-value-code-query';

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
          isUserEligible={isUserEligibleForBenefit(benefit.id, userBenefits)}
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
  const {openOperatorApp} = useOperatorApp();
  const {data: valueCode} = useValueCodeQuery(operatorId);

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
    if (isUserEligible && benefit.callToAction) {
      await Linking.openURL(
        insertValueCode(benefit.callToAction.url, valueCode),
      );
    } else {
      await openOperatorApp({operatorName, appStoreUri, rentalAppUri});
    }
  };

  return (
    <Section>
      <GenericSectionItem>
        <ThemeText type="body__primary--bold">{heading}</ThemeText>
        <ThemeText>{text}</ThemeText>
      </GenericSectionItem>
      <LinkSectionItem text={callToActionText} onPress={handleCallToAction} />
    </Section>
  );
};

const insertValueCode = (url: string, valueCode: string | null | undefined) => {
  if (!valueCode) return url;
  return url.replace(/\{(.*?)}/g, valueCode);
};
