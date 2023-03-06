import React from 'react';
import {Image, View} from 'react-native';
import {ThemeText} from '@atb/components/text';

type OperatorLogoProps = {
  operatorName: string;
  logoUrl: string | undefined;
};
export const OperatorLogo = ({operatorName, logoUrl}: OperatorLogoProps) => (
  <View style={{flex: 1, alignItems: 'center'}}>
    {logoUrl ? (
      <Image
        source={{uri: logoUrl}}
        style={{height: 50, width: 120}}
        resizeMode="contain"
      />
    ) : (
      <ThemeText type={'body__primary--big--bold'}>{operatorName}</ThemeText>
    )}
  </View>
);
