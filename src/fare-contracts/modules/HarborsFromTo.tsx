import {TravelRightDirection} from '@atb/ticketing';
import {ContrastColor} from '@atb-as/theme';
import {BorderedFromToBox} from '@atb/fare-contracts/components/BorderedFromToBox';
import {useHarbors} from '@atb/harbors';

type HarborsProps = {
  startPointRef: string;
  endPointRef?: string;
  direction?: TravelRightDirection;
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
  const {startPointName, endPointName} = useHarborsFromToController({
    startPointRef,
    endPointRef,
  });

  if (!startPointName) return null;
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

  const endPointName = endPointRef
    ? harbors.find((h) => h.id === endPointRef)?.name
    : undefined;
  return {
    startPointName,
    endPointName,
  };
}
