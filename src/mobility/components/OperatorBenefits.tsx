import React from 'react';
import {View, ViewStyle} from 'react-native';
import {useOperators} from '@atb/mobility/use-operators';
import {OperatorBenefitIdType} from '@atb-as/config-specs/lib/mobility-operators';
import {MessageBox} from '@atb/components/message-box';
import {getTextForLanguage} from '@atb/translations/utils';
import {useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';

type Props = {
  operatorId: string | undefined;
  userBenefits: OperatorBenefitIdType[];
  style?: ViewStyle;
};
export const OperatorBenefits = ({operatorId, userBenefits, style}: Props) => {
  const operators = useOperators();
  const {language} = useTranslation();
  const operator = operators.byId(operatorId);
  // The data model handles multiple benefits per operator,
  // but we currently know there is only one, and the UI has to change anyway
  // to support an undetermined number of benefits.
  const benefit = operator?.benefits?.[0];

  if (!benefit) return null;

  return (
    <View style={style}>
      {userBenefits.includes(benefit.id) ? (
        <ThemeText type={'body__secondary'} style={{textAlign: 'center'}}>
          {getTextForLanguage(benefit.descriptionWhenActive, language)}
        </ThemeText>
      ) : (
        <MessageBox
          type={'info'}
          message={
            getTextForLanguage(benefit.descriptionWhenNotActive, language) ?? ''
          }
        />
      )}
    </View>
  );
};
