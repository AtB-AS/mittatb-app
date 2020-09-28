import React from 'react';
import {Text} from 'react-native';
import MessageBox, {MessageBoxProps} from '../message-box';
import {Situation} from '../sdk';

export type SituationMessageProp = {
  situations: Situation[];
  containerStyle?: MessageBoxProps['containerStyle'];
};
export default function SituationMessages({
  situations,
  containerStyle,
}: SituationMessageProp) {
  if (!situations.some((s) => s.description.length)) {
    return null;
  }

  let uniqueSituations: {[id: string]: string} = {};
  for (let situation of situations) {
    if (uniqueSituations[situation.situationNumber]) continue;
    if (!situation.description[0]?.value) continue;
    uniqueSituations[situation.situationNumber] =
      situation.description[0]?.value;
  }

  return (
    <MessageBox type="warning" containerStyle={containerStyle}>
      {Object.entries(uniqueSituations).map(([id, situation]) => (
        <Text key={id}>{situation}</Text>
      ))}
    </MessageBox>
  );
}
