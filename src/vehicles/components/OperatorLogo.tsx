import React from 'react';
import {Image, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

type OperatorLogoProps = {
  operatorName: string;
  logoUrl: string | undefined;
};
export const OperatorLogo = ({operatorName, logoUrl}: OperatorLogoProps) => {
  const {enable_vehicle_operator_logo} = useRemoteConfig();
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      {logoUrl && enable_vehicle_operator_logo ? (
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
};
