import React from 'react';
import {MessageBox} from '@atb/components/message-box';
import {ThemeText} from '@atb/components/text';
import {OperatorBenefitsType} from '@atb/mobility/types';
import {View, ViewStyle} from 'react-native';

type Props = {
  benefits: OperatorBenefitsType | undefined;
  style?: ViewStyle;
};
export const OperatorBenefits = ({benefits, style}: Props) => {
  return (
    <View style={style}>
      {benefits ? (
        <MessageBox
          type={'info'}
          message={
            'Kjøper du AtB periodebillet får du gratis oppstart av el-sparkesykler'
          }
        />
      ) : (
        <ThemeText type={'body__secondary'} style={{textAlign: 'center'}}>
          Periodebilletten inkluderer unike fordeler som aktiveres her:
        </ThemeText>
      )}
    </View>
  );
};
