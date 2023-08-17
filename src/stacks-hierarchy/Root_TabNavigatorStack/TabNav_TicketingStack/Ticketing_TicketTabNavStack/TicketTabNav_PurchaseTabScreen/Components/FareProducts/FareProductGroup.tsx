import {
  FareProductTypeConfig,
  ProductTypeTransportModes,
} from '@atb-as/config-specs';
import {View} from 'react-native';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {FareProductTile} from './FareProductTile';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {TransportModes} from '@atb/components/transportation-modes';
import {ThemeText} from '@atb/components/text';

type Props = {
  heading?: string;
  transportModes: ProductTypeTransportModes[];
  fareProducts: FareProductTypeConfig[];
  onProductSelect: (config: FareProductTypeConfig) => void;
};

export const FareProductGroup = ({
  heading,
  transportModes,
  fareProducts,
  onProductSelect,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();

  /*
  Group by two and two, as two fare products are shown side by side on each row
  in the purchase tab.
   */
  const groupedConfigs = fareProducts.reduce<
    [FareProductTypeConfig, FareProductTypeConfig | undefined][]
  >((grouped, current, index, arr) => {
    if (index % 2 === 0) return [...grouped, [current, arr[index + 1]]];
    return grouped;
  }, []);

  return (
    <View>
      {heading ? (
        <ThemeText style={styles.heading}>{heading}</ThemeText>
      ) : (
        <TransportModes
          modes={transportModes}
          iconSize={'small'}
          style={styles.heading}
          textType={'body__secondary'}
          textColor={'primary'}
          unknownModeText={t(FareContractTexts.otherFareContracts)}
          useUnknownIcon={false}
        />
      )}
      {groupedConfigs.map(([firstConfig, secondConfig], i) => (
        <View
          style={[
            styles.fareProductsContainer,
            i > 0 ? styles.fareProductsContainer__row : undefined,
          ]}
          key={firstConfig.type + secondConfig?.type}
        >
          <FareProductTile
            onPress={() => onProductSelect(firstConfig)}
            testID={`${firstConfig.type}FareProduct`}
            config={firstConfig}
          />
          {secondConfig && (
            <FareProductTile
              onPress={() => onProductSelect(secondConfig)}
              testID={`${secondConfig.type}FareProduct`}
              config={secondConfig}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  heading: {
    margin: theme.spacings.medium,
    marginLeft: theme.spacings.xLarge,
  },
  fareProductsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: theme.spacings.medium,
    alignItems: 'stretch',
  },
  fareProductsContainer__row: {
    paddingTop: theme.spacings.medium,
  },
}));
