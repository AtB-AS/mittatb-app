import {TravelRightDirection} from '@atb-as/utils';
import {ContrastColor} from '@atb-as/theme';
import {BorderedFromToBox} from './BorderedFromToBox';
import {useHarbors} from '@atb/modules/harbors';

type HarborsProps = {
  startPointRef: string;
  endPointRef?: string;
  direction: TravelRightDirection;
  mode: 'small' | 'large';
  backgroundColor: ContrastColor;
};

export const HarborsFromTo = ({
  startPointRef,
  endPointRef,
  direction,
  mode,
  backgroundColor,
}: HarborsProps) => {
  const constrollerData = useHarborsFromToController({
    startPointRef,
    endPointRef,
  });
  if (!constrollerData) return null;
  const {startPointName, endPointName} = constrollerData;

  return (
    <BorderedFromToBox
      fromText={startPointName}
      toText={endPointName}
      direction={direction}
      mode={mode}
      backgroundColor={backgroundColor}
    />
  );
};

type HarborsFromToControllerProps = {
  startPointRef: string;
  endPointRef?: string;
};

function useHarborsFromToController({
  startPointRef,
  endPointRef,
}: HarborsFromToControllerProps) {
  const {data: harbors} = useHarbors();
  const startPointName = harbors.find((h) => h.id === startPointRef)?.name;
  if (!startPointName) return undefined;

  const endPointName = endPointRef
    ? harbors.find((h) => h.id === endPointRef)?.name
    : undefined;
  return {
    startPointName,
    endPointName,
  };
}
