import React from 'react';
import {FareContractType} from '@atb-as/utils';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {FareContractFromTo} from '../components/FareContractFromTo';
import {Description} from '../components/FareContractDescription';
import {ValidTo} from '../components/ValidTo';
import {WithValidityLine} from '../components/WithValidityLine';
import {ProductName} from '../components/ProductName';
import {ValidityTime} from '../components/ValidityTime';
import {SentToMessageBox} from '../components/SentToMessageBox';

type Props = {
  fareContract: FareContractType;
};

export const FareContractHeaderSectionItem = ({
  fareContract: fc,
  ...props
}: SectionItemProps<Props>) => {
  const {topContainer} = useSectionItem(props);
  const {theme} = useThemeContext();
  const styles = useStyles();

  return (
    <View style={[topContainer, styles.sectionItemOverrides]}>
      <WithValidityLine fc={fc}>
        <ProductName fc={fc} />
        <ValidityTime fc={fc} />
        <ValidTo fc={fc} />
        <Description fc={fc} />
      </WithValidityLine>
      <View style={styles.fareContractDetails}>
        <SentToMessageBox fc={fc} />
        <FareContractFromTo
          backgroundColor={theme.color.background.neutral['0']}
          mode="large"
          fc={fc}
        />
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sectionItemOverrides: {
    borderWidth: 0,
    paddingVertical: 0,
  },
  fareContractDetails: {
    flex: 1,
    paddingBottom: theme.spacing.large,
    rowGap: theme.spacing.medium,
  },
}));
