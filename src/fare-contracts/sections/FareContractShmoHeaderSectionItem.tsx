import React from 'react';
import {FareContract} from '@atb/ticketing';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ProductName} from '@atb/fare-contracts/components/ProductName';
import {ValidityTime} from '@atb/fare-contracts/components/ValidityTime';

type Props = {
  fareContract: FareContract;
};

export const FareContractShmoHeaderSectionItem = ({
  fareContract: fc,
  ...props
}: SectionItemProps<Props>) => {
  const {topContainer} = useSectionItem(props);
  const styles = useStyles();

  return (
    <View style={[topContainer, styles.container]}>
      <ProductName fc={fc} />
      <ValidityTime fc={fc} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: theme.spacing.small,
  },
}));
