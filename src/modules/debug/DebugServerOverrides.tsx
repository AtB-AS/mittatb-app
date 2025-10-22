import {AxiosRequestHeaders} from 'axios';
import React from 'react';
import {View} from 'react-native';

type ServerOverride = {
  match: RegExp;
  newValue: string;
  headers: AxiosRequestHeaders;
};

export function DebugServerOverrides() {
  const [];
  return <View />;
}
