import {StyleSheet} from '@atb/theme';
import {ValidityLine} from '@atb/fare-contracts/components/ValidityLine';
import {View} from 'react-native';
import React, {type PropsWithChildren} from 'react';
import type {Reservation} from '@atb/ticketing';
import {FareContractType} from '@atb-as/utils';
import {
  getFareContractInfo,
  getReservationStatus,
} from '@atb/fare-contracts/utils';
import {useTimeContext} from '@atb/time';
import {useAuthContext} from '@atb/auth';
import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/configuration';

type Props = PropsWithChildren<
  | {
      fc: FareContractType;
    }
  | ({reservation: Reservation} & {enabledLine?: boolean})
>;

export const WithValidityLine = (props: Props) => {
  const styles = useStyles();
  const {serverNow} = useTimeContext();
  const {abtCustomerId: currentUserId} = useAuthContext();
  const {preassignedFareProducts} = useFirestoreConfigurationContext();

  if ('reservation' in props) {
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
  } else if ('fc' in props) {
    const firstTravelRight = getFareContractInfo(serverNow, props.fc)
      .travelRights?.[0];
    const preassignedFareProduct = findReferenceDataById(
      preassignedFareProducts,
      firstTravelRight.fareProductRef,
    );
    const {validityStatus} = getFareContractInfo(
      serverNow,
      props.fc,
      currentUserId,
    );
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
  return null;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'column',
    marginHorizontal: -theme.spacing.medium,
    borderTopRightRadius: theme.border.radius.regular,
    borderTopLeftRadius: theme.border.radius.regular,
    overflow: 'hidden',
  },
  content: {
    paddingVertical: theme.spacing.large,
    paddingHorizontal: theme.spacing.medium,
    alignItems: 'center',
    rowGap: theme.spacing.small,
  },
}));
