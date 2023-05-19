import {Image, View} from 'react-native';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Car} from '@atb/assets/svg/mono-icons/transportation';

type Props = {
  uri: string | undefined;
};
export const CarImage = ({uri}: Props) => {
  return uri ? (
    <Image
      style={{height: 75, width: 100, resizeMode: 'contain'}}
      source={{uri}}
    />
  ) : (
    <DefaultCarImage />
  );
};

const DefaultCarImage = () => {
  return (
    <View
      style={{
        height: 75,
        width: 100,
        backgroundColor: '#d8d8d8',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ThemeIcon size={'large'} fill={'#A9AEB1'} svg={Car} />
    </View>
  );
};
