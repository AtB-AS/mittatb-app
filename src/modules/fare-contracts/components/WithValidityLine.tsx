import {StyleSheet} from '@atb/theme';
import {ValidityLine} from './ValidityLine';
import {View} from 'react-native';
import React, {type PropsWithChildren} from 'react';
import type {Reservation} from '@atb/modules/ticketing';
import {FareContractType} from '@atb-as/utils';
import {useTimeContext} from '@atb/modules/time';
import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {useFareContractInfo} from '../useFareContractInfo';
import {getReservationStatus} from '@atb/modules/fare-contracts';

type FcProps = PropsWithChildren<{
  fc: FareContractType;
}>;

type ReservationProps = PropsWithChildren<
  {reservation: Reservation} & {enabledLine?: boolean}
>;

type Props = FcProps | ReservationProps;

export const WithValidityLine = (props: Props) => {
  if ('reservation' in props) {
    return (
      <WithReservationValidityLine
        reservation={props.reservation}
        enabledLine={props.enabledLine}
      >
        {props.children}
      </WithReservationValidityLine>
    );
  } else if ('fc' in props) {
    return (
      <WithFcValiditityLine fc={props.fc}>
        {props.children}
      </WithFcValiditityLine>
    );
  }
  return null;
};

export function WithReservationValidityLine(props: ReservationProps) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      {!!props.enabledLine && (
        <ValidityLine status={getReservationStatus(props.reservation)} />
      )}
      {!!props.children ? (
        <View style={styles.content}>{props.children}</View>
      ) : null}
    </View>
  );
}

export function WithFcValiditityLine(props: FcProps) {
  const {serverNow} = useTimeContext();
  const {preassignedFareProducts} = useFirestoreConfigurationContext();
  const {travelRights, validityStatus} = useFareContractInfo({
    now: serverNow,
    fc: props.fc,
  });
  const firstTravelRight = travelRights?.[0];
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    firstTravelRight.fareProductRef,
  );
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ValidityLine
        status={validityStatus}
        fareProductType={preassignedFareProduct?.type}
      />
      {!!props.children ? (
        <View style={styles.content}>{props.children}</View>
      ) : null}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'column',
    marginHorizontal: -theme.spacing.medium,
    borderTopRightRadius: theme.border.radius.regular,
    borderTopLeftRadius: theme.border.radius.regular,
    overflow: 'hidden',
    flex: 1,
  },
  content: {
    paddingVertical: theme.spacing.large,
    paddingHorizontal: theme.spacing.medium,
    alignItems: 'center',
    rowGap: theme.spacing.small,
  },
}));
