import {
  FareProductTypeConfig,
  ProductTypeTransportModes,
} from '@atb-as/config-specs';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {FareProductTile} from './FareProductTile';
import React from 'react';
import {StyleSheet} from '@atb/theme';

type Props = {
  transportModes: ProductTypeTransportModes[];
  fareProducts: FareProductTypeConfig[];
  onProductSelect: (config: FareProductTypeConfig) => void;
};

export const FareProductGroup = ({
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
      <ThemeText type="body__secondary" style={styles.heading}>
        {transportModes
          .map((mode) =>
            t(FareContractTexts.transportMode(mode.mode, mode.subMode)),
          )
          .join(', ')}
      </ThemeText>

      {groupedConfigs.map(([firstConfig, secondConfig]) => (
        <View
          style={styles.fareProductsContainer}
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
    textTransform: 'capitalize',
  },
  fareProductsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
    alignItems: 'stretch',
  },
}));
