import {
  FareProductTypeConfig,
  ProductTypeTransportModes,
} from '@atb/configuration';
import {View} from 'react-native';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {FareProductTile} from './FareProductTile';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {TransportModes} from '@atb/components/transportation-modes';

type Props = {
  heading?: string | undefined;
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
        <TransportModes
          modes={transportModes}
          iconSize="xSmall"
          style={styles.heading}
          textType="body__secondary"
          textColor="primary"
          customTransportModeText={heading}
        />
      ) : (
        <TransportModes
          modes={transportModes}
          iconSize="xSmall"
          style={styles.heading}
          textType="body__secondary"
          textColor="primary"
          customTransportModeText={
            transportModes.length === 0
              ? t(FareContractTexts.otherFareContracts)
              : undefined
          }
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
    marginTop: theme.spacings.large,
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
