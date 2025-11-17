import {StyleSheet} from '@atb/theme';
import {ValidityLine} from './ValidityLine';
import {View} from 'react-native';
import React, {type PropsWithChildren} from 'react';
import {type Reservation} from '@atb/modules/ticketing';
import {getReservationStatus} from '../utils';
import {useAuthContext} from '@atb/modules/auth';
import {FareContractInfo} from '../use-fare-contract-info';
import {useTimeContext} from '@atb/modules/time';

type Props = PropsWithChildren<
  | {
      fc: FareContractInfo;
    }
  | ({reservation: Reservation} & {enabledLine?: boolean})
>;

export const WithValidityLine = (props: Props) => {
  if ('reservation' in props) {
    return <ReservationValidityLine {...props} />;
  } else if ('fc' in props) {
    return <FareContractValidityLine {...props} />;
  }
  return null;
};

const FareContractValidityLine = (
  props: PropsWithChildren<{fc: FareContractInfo}>,
) => {
  const styles = useStyles();
  const {serverNow} = useTimeContext();
  const {abtCustomerId: currentUserId} = useAuthContext();
  const {validityStatus} = props.fc.getValidityInfo(serverNow, currentUserId);

  return (
    <View style={styles.container} testID={`${validityStatus}Ticket`}>
      <ValidityLine
        status={validityStatus}
        transportModes={props.fc.allTransportModes}
      />
      {!!props.children ? (
        <View style={styles.content}>{props.children}</View>
      ) : null}
    </View>
  );
};

const ReservationValidityLine = (
  props: PropsWithChildren<{reservation: Reservation; enabledLine?: boolean}>,
) => {
  const styles = useStyles();

  return (
    <View
      style={styles.container}
      testID={`${getReservationStatus(props.reservation)}Ticket`}
    >
      {!!props.enabledLine && (
        <ValidityLine status={getReservationStatus(props.reservation)} />
      )}
      {!!props.children ? (
        <View style={styles.content}>{props.children}</View>
      ) : null}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'column',
    marginHorizontal: -theme.spacing.medium + theme.border.width.slim,
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
