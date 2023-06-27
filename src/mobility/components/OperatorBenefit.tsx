import React from 'react';
import {View, ViewStyle} from 'react-native';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
import {MessageBox} from '@atb/components/message-box';
import {getTextForLanguage} from '@atb/translations/utils';
import {useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';

type Props = {
  benefit: OperatorBenefitType | undefined;
  isUserEligible: boolean;
  style?: ViewStyle;
};
export const OperatorBenefit = ({isUserEligible, benefit, style}: Props) => {
  const {language} = useTranslation();

  if (!benefit) return null;

  return (
    <View style={style}>
      {isUserEligible ? (
        <ThemeText type={'body__secondary'} style={{textAlign: 'center'}}>
          {getTextForLanguage(benefit.descriptionWhenActive, language)}
        </ThemeText>
      ) : (
        <MessageBox
          type={'info'}
          message={
            getTextForLanguage(benefit.descriptionWhenNotActive, language) ?? ''
          }
          isMarkdown={true}
        />
      )}
    </View>
  );
};
