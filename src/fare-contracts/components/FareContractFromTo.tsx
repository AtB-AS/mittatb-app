import {ContrastColor} from '@atb-as/theme';
import {ArrowDown, ArrowUpDown} from '@atb/assets/svg/mono-icons/navigation';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {type RecentFareContractType} from '@atb/recent-fare-contracts';
import {StyleSheet} from '@atb/theme';
import {FareContract, TravelRightDirection} from '@atb/ticketing';
import {dictionary, FareContractTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import type {PreassignedFareProduct} from '@atb-as/config-specs';
import {
  useFareContractFromTo,
  useHarborsFromTo,
  useZonesFromTo,
} from '@atb/fare-contracts/components/FareContractFromToComponentHooks';

type FareContractFromToBaseProps = {
  backgroundColor: ContrastColor;
  mode: 'small' | 'large';
  preassignedFareProduct?: PreassignedFareProduct;
};

export type FareContractPropsSub = {
  fc: FareContract;
};

export type RecentFareContractPropsSub = {
  rfc: RecentFareContractType;
};

type FareContractFromToProps = FareContractFromToBaseProps &
  (FareContractPropsSub | RecentFareContractPropsSub);

export const FareContractFromTo = (props: FareContractFromToProps) => {
  const {
    shouldReturnNull,
    tariffZoneRefs,
    direction,
    startPointRef,
    endPointRef,
  } = useFareContractFromTo({
    preassignedFareProduct: props.preassignedFareProduct,
    fcOrRfc: 'rfc' in props ? props.rfc : props.fc,
  });

  if (shouldReturnNull) return null;

  if (tariffZoneRefs.length) {
    return (
      <ZonesFromTo
        tariffZoneRefs={tariffZoneRefs}
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
  tariffZoneRefs: string[];
  mode: 'small' | 'large';
  backgroundColor: ContrastColor;
};

const ZonesFromTo = ({tariffZoneRefs, mode, backgroundColor}: ZonesProps) => {
  const {t} = useTranslation();
  const {fromZoneName, toZoneName} = useZonesFromTo({
    tariffZoneRefs,
  });
  if (!fromZoneName) return null;

  const fromZoneText = `${t(dictionary.zone)} ${fromZoneName}`;
  const toZoneText = toZoneName
    ? `${t(dictionary.zone)} ${toZoneName}`
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
  const {startPointName, endPointName} = useHarborsFromTo({
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
    <View accessible accessibilityLabel={accessibilityLabel}>
      <BorderedInfoBox backgroundColor={backgroundColor} type={mode}>
        {mode === 'large' ? largeLayout() : smallLayout()}
      </BorderedInfoBox>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
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
