import React from 'react';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {ContentHeading} from '@atb/components/heading';
import {useTranslation} from '@atb/translations';
import {ShmoHelpTexts} from '@atb/translations/screens/ShmoHelp';

type Props = {
  operatorName: string | undefined;
  onContactFormPress: () => void;
  onReportParkingPress: () => void;
};

export const ScooterContactSection = ({
  operatorName,
  onContactFormPress,
  onReportParkingPress,
}: Props) => {
  const {t} = useTranslation();
  return (
    <>
      <ContentHeading text={t(ShmoHelpTexts.contactAndReport)} />
      <Section>
        {!!operatorName && (
          <LinkSectionItem
            text={t(ShmoHelpTexts.contactOperator(operatorName))}
            onPress={onContactFormPress}
          />
        )}
        <LinkSectionItem
          text={t(ShmoHelpTexts.reportParking)}
          onPress={onReportParkingPress}
        />
      </Section>
    </>
  );
};
