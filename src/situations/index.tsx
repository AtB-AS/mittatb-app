import React, {ComponentProps} from 'react';
import {Warning} from '../assets/svg/color/situations';
import ThemeText from '../components/text';
import MessageBox, {MessageBoxProps} from '../components/message-box';
import {Situation as Situation_v1} from '../sdk';
import {Situation as Situation_from_Trips} from '@atb/api/types/trips';
import {useTheme} from '@atb/theme';

export type SituationMessageProps = {
  situations: Situation_v1[] | Situation_from_Trips[];
  mode?: 'no-icon' | 'icon';
  containerStyle?: MessageBoxProps['containerStyle'];
};
export default function SituationMessages({
  situations,
  mode = 'icon',
  containerStyle,
}: SituationMessageProps) {
  const {theme} = useTheme();
  if (!hasSituations(situations)) {
    return null;
  }

  const uniqueSituations = getUniqueSituations(situations);
  const icon = mode === 'no-icon' ? null : undefined;
  return (
    <MessageBox type="warning" icon={icon} containerStyle={containerStyle}>
      {Object.entries(uniqueSituations).map(([id, situation]) => (
        <ThemeText key={id} style={{color: theme.static.status.warning.text}}>
          {situation}
        </ThemeText>
      ))}
    </MessageBox>
  );
}

export type SituationWarningProps = {
  situations: Situation_v1[] | Situation_from_Trips[];
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

export function hasSituations(
  situations: Situation_v1[] | Situation_from_Trips[],
) {
  return situations?.some((s) => s.description.length) ?? false;
}

export function getSituationDiff(
  situations: Situation_v1[],
  parent: Situation_v1[],
) {
  const notInParent =
    situations?.filter((situation) => {
      return parent.every(
        (pSituation) => pSituation.situationNumber != situation.situationNumber,
      );
    }) ?? [];
  return notInParent;
}

export function getUniqueSituations(
  situations: Situation_v1[] | Situation_from_Trips[] = [],
) {
  let uniqueSituations: {[id: string]: string} = {};
  for (let situation of situations) {
    if (
      !situation.situationNumber ||
      uniqueSituations[situation.situationNumber]
    )
      continue;
    let value = situation.description[0]?.value;
    if (!value && 'summary' in situation && situation.summary[0]?.value) {
      value = situation.summary[0]?.value;
    }
    if (!value) continue;
    if (Object.values(uniqueSituations).includes(value)) continue;
    uniqueSituations[situation.situationNumber] = value;
  }
  return uniqueSituations;
}

export function situationMessages(situations: Situation_v1[]) {
  const unique = Object.values(getUniqueSituations(situations));
  return unique.join('. ');
}
