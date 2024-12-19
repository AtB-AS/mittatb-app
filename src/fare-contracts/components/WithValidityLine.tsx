import {StyleSheet} from '@atb/theme';
import {ValidityLine} from '@atb/fare-contracts/ValidityLine';
import {View} from 'react-native';
import React, {type PropsWithChildren} from 'react';
import type {FareContract} from '@atb/ticketing';
import {getFareContractInfo} from '@atb/fare-contracts/utils';
import {useTimeContext} from '@atb/time';
import {useAuthContext} from '@atb/auth';
import type {PreassignedFareProduct} from '@atb-as/config-specs';

type Props = PropsWithChildren<{
  fc: FareContract;
  preassignedFareProduct?: PreassignedFareProduct;
}>;

export const WithValidityLine = ({
  fc,
  preassignedFareProduct,
  children,
}: Props) => {
  const styles = useStyles();
  const {serverNow} = useTimeContext();
  const {abtCustomerId: currentUserId} = useAuthContext();
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
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'column',
  },
  content: {
    paddingVertical: theme.spacing.large,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    rowGap: theme.spacing.medium,
  },
}));
