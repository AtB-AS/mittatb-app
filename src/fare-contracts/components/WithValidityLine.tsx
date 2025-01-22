import {StyleSheet} from '@atb/theme';
import {ValidityLine} from '@atb/fare-contracts/ValidityLine';
import {View} from 'react-native';
import React, {type PropsWithChildren} from 'react';
import type {FareContract} from '@atb/ticketing';
import {getFareContractInfo} from '@atb/fare-contracts/utils';
import {useTimeContext} from '@atb/time';
import {useAuthContext} from '@atb/auth';
import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/configuration';

type Props = PropsWithChildren<{
  fc: FareContract;
}>;

export const WithValidityLine = ({fc, children}: Props) => {
  const styles = useStyles();
  const {serverNow} = useTimeContext();
  const {abtCustomerId: currentUserId} = useAuthContext();
  const firstTravelRight = getFareContractInfo(serverNow, fc).travelRights?.[0];
  const {preassignedFareProducts} = useFirestoreConfigurationContext();
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    firstTravelRight.fareProductRef,
  );
  const {validityStatus, validFrom, validTo} = getFareContractInfo(
    serverNow,
    fc,
    currentUserId,
  );
  return (
    <View style={styles.container}>
      <ValidityLine
        status={validityStatus}
        now={serverNow}
        validFrom={validFrom}
        validTo={validTo}
        fareProductType={preassignedFareProduct?.type}
      />
      {!!children ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
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
