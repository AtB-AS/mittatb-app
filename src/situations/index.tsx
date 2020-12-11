import React, {ComponentProps} from 'react';
import {Warning} from '../assets/svg/situations';
import ThemeText from '../components/text';
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
        <ThemeText key={id}>{situation}</ThemeText>
      ))}
    </MessageBox>
  );
}

export type SituationWarningProps = {
  situations: Situation[];
  style?: ComponentProps<typeof Warning>['style'];
  accessibilityLabel?: string;
};

export function SituationWarningIcon({
  situations,
  style,
  accessibilityLabel,
}: SituationWarningProps) {
  if (!hasSituations(situations)) {
    return null;
  }

  return <Warning accessibilityLabel={accessibilityLabel} style={style} />;
}

export function hasSituations(situations: Situation[]) {
  return situations?.some((s) => s.description.length) ?? false;
}

export function getSituationDiff(situations: Situation[], parent: Situation[]) {
  const notInParent =
    situations?.filter((situation) => {
      return parent.every(
        (pSituation) => pSituation.situationNumber != situation.situationNumber,
      );
    }) ?? [];
  return notInParent;
}

export function getUniqueSituations(situations: Situation[] = []) {
  let uniqueSituations: {[id: string]: string} = {};
  for (let situation of situations) {
    if (uniqueSituations[situation.situationNumber]) continue;
    const value = situation.description[0]?.value;
    if (!value) continue;
    if (Object.values(uniqueSituations).includes(value)) continue;
    uniqueSituations[situation.situationNumber] = value;
  }
  return uniqueSituations;
}

export function situationMessages(situations: Situation[]) {
  const unique = Object.values(getUniqueSituations(situations));
  return unique.join('. ');
}
