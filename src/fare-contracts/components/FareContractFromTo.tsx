import {ContrastColor} from '@atb-as/theme';
import {ArrowDown, ArrowUpDown} from '@atb/assets/svg/mono-icons/navigation';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  findReferenceDataById,
  getReferenceDataName,
  useFirestoreConfigurationContext,
} from '@atb/configuration';
import {useHarbors} from '@atb/harbors';
import {type RecentFareContractType} from '@atb/recent-fare-contracts';
import {StyleSheet} from '@atb/theme';
import {
  FareContract,
  isNormalTravelRight,
  TravelRightDirection,
} from '@atb/ticketing';
import {dictionary, FareContractTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';

type FareContractFromToBaseProps = {
  backgroundColor: ContrastColor;
  mode: 'small' | 'large';
};

type FareContractPropsSub = {
  fc: FareContract;
};

type RecentFareContractPropsSub = {
  rfc: RecentFareContractType;
};

type FareContractFromToProps = FareContractFromToBaseProps &
  (FareContractPropsSub | RecentFareContractPropsSub);

export const FareContractFromTo = (props: FareContractFromToProps) => {
  const tariffZoneRefs = (() => {
    if (hasFareContract(props)) {
      const travelRight = props.fc.travelRights[0];
      if (isNormalTravelRight(travelRight)) {
        return travelRight.tariffZoneRefs ?? [];
      }
    } else if (hasRecentFareContract(props)) {
      if (props.rfc.fromTariffZone) {
        return [
          props.rfc.fromTariffZone.id,
          ...(props.rfc.toTariffZone ? [props.rfc.toTariffZone.id] : []),
        ];
      }
    }
    return [];
  })();

  const direction = (() => {
    if (hasFareContract(props)) {
      const travelRight = props.fc.travelRights[0];
      if (isNormalTravelRight(travelRight)) {
        if (!!travelRight.direction) {
          // A travelRight between quays (e.g. for boat)
          return travelRight.direction;
        } else if (travelRight.tariffZoneRefs?.length ?? 0 > 1) {
          // A travelRight between several zones (e.g. for bus)
          return TravelRightDirection.Both;
        }
      }
    } else if (hasRecentFareContract(props)) {
      if (!!props.rfc.direction) {
        return props.rfc.direction;
      } else if (props.rfc.fromTariffZone?.id !== props.rfc.toTariffZone?.id) {
        return TravelRightDirection.Both;
      }
    }
  })();

  const {startPointRef = undefined, endPointRef = undefined} = (() => {
    if (hasFareContract(props)) {
      const travelRight = props.fc.travelRights[0];
      if (!isNormalTravelRight(travelRight)) return {};
      return {
        startPointRef: travelRight.startPointRef,
        endPointRef: travelRight.endPointRef,
      };
    } else if (hasRecentFareContract(props) && props.rfc.pointToPointValidity) {
      return {
        startPointRef: props.rfc.pointToPointValidity.fromPlace,
        endPointRef: props.rfc.pointToPointValidity.toPlace,
      };
    }
    return {};
  })();
  if (tariffZoneRefs.length) {
    return (
      <ZonesFromTo
        tarifZoneRefs={tariffZoneRefs}
        mode={props.mode}
        backgroundColor={props.backgroundColor}
      />
    );
  } else if (startPointRef) {
    return (
      <HarborsFromTo
        startPointRef={startPointRef}
        endPointRef={endPointRef}
        direction={direction}
        mode={props.mode}
        backgroundColor={props.backgroundColor}
      />
    );
  }
  return null;
};

type ZonesProps = {
  tarifZoneRefs: string[];
  mode: 'small' | 'large';
  backgroundColor: ContrastColor;
};

const ZonesFromTo = ({tarifZoneRefs, mode, backgroundColor}: ZonesProps) => {
  const {tariffZones} = useFirestoreConfigurationContext();
  const {t, language} = useTranslation();

  const fromZoneId = tarifZoneRefs[0];
  const fromZone = findReferenceDataById(tariffZones, fromZoneId);
  if (!fromZone) return null;
  const fromZoneText = `${t(dictionary.zone)} ${getReferenceDataName(
    fromZone,
    language,
  )}`;

  const toZoneId = tarifZoneRefs[tarifZoneRefs.length - 1];
  const toZone =
    fromZoneId !== toZoneId
      ? findReferenceDataById(tariffZones, toZoneId)
      : undefined;
  const toZoneText = toZone
    ? `${t(dictionary.zone)} ${getReferenceDataName(toZone, language)}`
    : undefined;

  return (
    <BorderedFromToBox
      fromText={fromZoneText}
      toText={toZoneText}
      direction={TravelRightDirection.Both}
      mode={mode}
      backgroundColor={backgroundColor}
    />
  );
};

type HarborsProps = {
  startPointRef: string;
  endPointRef?: string;
  direction?: TravelRightDirection;
  mode: 'small' | 'large';
  backgroundColor: ContrastColor;
};

const HarborsFromTo = ({
  startPointRef,
  endPointRef,
  direction,
  mode,
  backgroundColor,
}: HarborsProps) => {
  const {data: harbors} = useHarbors();
  const startPointName = harbors.find((h) => h.id === startPointRef)?.name;
  if (!startPointName) return null;

  const endPointName = endPointRef
    ? harbors.find((h) => h.id === endPointRef)?.name
    : undefined;

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

type BorderedFromToBoxProps = {
  fromText: string;
  toText?: string;
  direction?: TravelRightDirection;
  mode: 'small' | 'large';
  backgroundColor: ContrastColor;
};

const BorderedFromToBox = ({
  fromText,
  toText,
  direction,
  mode,
  backgroundColor,
}: BorderedFromToBoxProps) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const accessibilityLabel = !!toText
    ? t(
        FareContractTexts.details.fromTo(
          fromText,
          toText ?? fromText,
          direction === TravelRightDirection.Both,
        ),
      )
    : t(FareContractTexts.details.validIn(fromText));

  const smallLayout = () => {
    if (!toText)
      return (
        <View style={styles.smallContent}>
          <ThemeText color={backgroundColor} typography="body__tertiary">
            {fromText}
          </ThemeText>
        </View>
      );
    return (
      <View style={styles.smallContent}>
        <ThemeIcon
          color={backgroundColor}
          svg={
            direction === TravelRightDirection.Both ? ArrowUpDown : ArrowDown
          }
          size="small"
        />
        <View style={styles.smallContentText}>
          <ThemeText color={backgroundColor} typography="body__tertiary">
            {fromText}
          </ThemeText>
          <ThemeText color={backgroundColor} typography="body__tertiary">
            {toText}
          </ThemeText>
        </View>
      </View>
    );
  };

  const largeLayout = () => (
    <View style={styles.largeContent}>
      <ThemeText color={backgroundColor} typography="body__primary--bold">
        {fromText}
      </ThemeText>
      {toText && (
        <>
          <ThemeIcon
            color={backgroundColor}
            svg={
              direction === TravelRightDirection.Both ? ArrowUpDown : ArrowDown
            }
            size="normal"
          />
          <ThemeText color={backgroundColor} typography="body__primary--bold">
            {toText}
          </ThemeText>
        </>
      )}
    </View>
  );

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={accessibilityLabel}
    >
      <BorderedInfoBox backgroundColor={backgroundColor} type={mode}>
        {mode === 'large' ? largeLayout() : smallLayout()}
      </BorderedInfoBox>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    width: '100%',
  },
  largeContent: {
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: theme.spacing.xSmall,
  },
  smallContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    columnGap: theme.spacing.xSmall,
  },
  smallContentText: {
    flexDirection: 'column',
    paddingLeft: theme.spacing.xSmall,
  },
}));

function hasFareContract(
  props: FareContractFromToProps,
): props is FareContractFromToBaseProps & FareContractPropsSub {
  return 'fc' in props;
}

function hasRecentFareContract(
  props: FareContractFromToProps,
): props is FareContractFromToBaseProps & RecentFareContractPropsSub {
  return 'rfc' in props;
}
