import React from 'react';
import {ViewStyle} from 'react-native';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
import {MessageBox} from '@atb/components/message-box';
import {getTextForLanguage} from '@atb/translations/utils';
import {useTranslation} from '@atb/translations';

type Props = {
  benefit: OperatorBenefitType | undefined;
  isUserEligible: boolean;
  style?: ViewStyle;
};
export const OperatorBenefit = ({isUserEligible, benefit, style}: Props) => {
  const {language} = useTranslation();

  const text = getTextForLanguage(
    isUserEligible
      ? benefit?.descriptionWhenActive
      : benefit?.descriptionWhenNotActive,
    language,
  );

  if (!text) return null;

  return (
    <MessageBox style={style} type={'info'} message={text} isMarkdown={true} />
  );
};
