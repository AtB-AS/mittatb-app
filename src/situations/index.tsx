import React, {ComponentProps} from 'react';
import {Text} from 'react-native';
import {Warning} from '../assets/svg/situations';
import MessageBox, {MessageBoxProps} from '../message-box';
import {Situation} from '../sdk';

export type SituationMessageProps = {
  situations: Situation[];
  mode?: 'no-icon' | 'icon';
  containerStyle?: MessageBoxProps['containerStyle'];
};
export default function SituationMessages({
  situations,
  mode = 'icon',
  containerStyle,
}: SituationMessageProps) {
  if (!hasSituations(situations)) {
    return null;
  }

  const uniqueSituations = getUniqueSituations(situations);
  const icon = mode === 'no-icon' ? null : undefined;

  return (
    <MessageBox type="warning" icon={icon} containerStyle={containerStyle}>
      {Object.entries(uniqueSituations).map(([id, situation]) => (
        <Text key={id}>{situation}</Text>
      ))}
    </MessageBox>
  );
}

export type SituationWarningProps = {
  situations: Situation[];
  style?: ComponentProps<typeof Warning>['style'];
};

export function SituationWarningIcon({
  situations,
  style,
}: SituationWarningProps) {
  if (!hasSituations(situations)) {
    return null;
  }

  return (
    <Warning
      accessibilityLabel="Denne reisen har en driftsmelding"
      style={style}
    />
  );
}

export function hasSituations(situations: Situation[]) {
  return situations.some((s) => s.description.length);
}

export function getSituationDiff(situations: Situation[], parent: Situation[]) {
  const notInParent = situations.filter((situation) => {
    return parent.every(
      (pSituation) => pSituation.situationNumber != situation.situationNumber,
    );
  });
  return notInParent;
}

export function getUniqueSituations(situations: Situation[]) {
  let uniqueSituations: {[id: string]: string} = {};
  for (let situation of situations) {
    if (uniqueSituations[situation.situationNumber]) continue;
    if (!situation.description[0]?.value) continue;
    uniqueSituations[situation.situationNumber] =
      situation.description[0]?.value;
  }
  return uniqueSituations;
}

export function situationMessages(situations: Situation[]) {
  const unique = Object.values(getUniqueSituations(situations));
  return unique.join('. ');
}
