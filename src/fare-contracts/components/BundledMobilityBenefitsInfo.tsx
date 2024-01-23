import {StyleProp, View, ViewStyle} from 'react-native';
import {useOperatorBenefitsForFareProduct} from '@atb/mobility/use-operator-benefits-for-fare-product';
import {ThemeText} from '@atb/components/text';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {BenefitImageAsset} from '@atb/mobility/components/BenefitImage';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import React from 'react';

export const BundledMobilityBenefitsInfo = ({
  fareProductId,
  style,
}: {
  fareProductId?: string;
  style?: StyleProp<ViewStyle>;
}) => {
  const {benefits, status} = useOperatorBenefitsForFareProduct(fareProductId);
  if (status !== 'success') return null;
  if (!benefits?.length) return null;

  return (
    <View style={style}>
      <ThemeText type="body__secondary" color="secondary">
        Inkludert i billetten
      </ThemeText>
      <BorderedInfoBox
        backgroundColor="background_0"
        type="large"
        style={{marginTop: 8}}
      >
        <View style={{gap: 8}}>
          {benefits.map((b) => (
            <BenefitInfo benefit={b} />
          ))}
        </View>
      </BorderedInfoBox>
    </View>
  );
};

const BenefitInfo = ({benefit}: {benefit: OperatorBenefitType}) => {
  const {language} = useTranslation();
  return (
    <View style={{flexDirection: 'row', flex: 1, gap: 8}}>
      <View style={{height: 18, aspectRatio: 1}}>
        <BenefitImageAsset
          formFactor={FormFactor.Bicycle} // TODO: FormFactor from benefit
          svgProps={{height: '100%', width: '100%'}}
        />
      </View>
      <ThemeText type="body__tertiary">
        {getTextForLanguage(benefit.ticketDescription, language)}
      </ThemeText>
    </View>
  );
};
