import {
  FareProductTypeConfig,
  ProductTypeTransportModes,
} from '@atb/modules/configuration';
import {View} from 'react-native';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {FareProductTile} from './FareProductTile';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {
  TransportationIconBoxList,
  TransportModePair,
} from '@atb/components/icon-box';
import {getTransportModeText} from '@atb/components/transportation-modes';
import {ThemeText} from '@atb/components/text';
import {TRANSPORTATION_ICON_BOX_LIST_MAX_ITEMS} from '@atb/components/icon-box';

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
      <View style={styles.heading}>
        <TransportModesWithHeading
          modes={transportModes}
          headingOverride={heading}
        />
      </View>
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
            productGroupTransportModes={transportModes}
          />
          {secondConfig && (
            <FareProductTile
              onPress={() => onProductSelect(secondConfig)}
              testID={`${secondConfig.type}FareProduct`}
              config={secondConfig}
              productGroupTransportModes={transportModes}
            />
          )}
        </View>
      ))}
    </View>
  );
};

export const TransportModesWithHeading = ({
  modes,
  headingOverride,
}: {
  modes: TransportModePair[];
  headingOverride?: string;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const transportModeText: string = getTransportModeText(modes, t);

  const heading = (() => {
    if (headingOverride) return headingOverride;
    if (modes.length === 0) return t(FareContractTexts.otherFareContracts);
    if (modes.length > TRANSPORTATION_ICON_BOX_LIST_MAX_ITEMS)
      return t(FareContractTexts.transportModes.more);
    return transportModeText;
  })();

  const a11yLabel = (() => {
    if (modes.length > 0 && headingOverride) {
      return t(
        FareContractTexts.transportModes.a11yLabelWithCustomText(
          transportModeText,
          headingOverride,
        ),
      );
    }
    if (modes.length > 0)
      return t(FareContractTexts.transportModes.a11yLabel(transportModeText));
    if (headingOverride) return headingOverride;
    return t(FareContractTexts.otherFareContracts);
  })();

  return (
    <View
      style={styles.transportationModesContainer}
      accessibilityLabel={a11yLabel}
      accessible={true}
    >
      {modes.length > 0 && (
        <TransportationIconBoxList modes={modes} iconSize="xSmall" />
      )}
      <ThemeText typography="body__s">{heading}</ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  transportationModesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.xSmall,
  },
  transportationIcon: {
    marginRight: theme.spacing.xSmall,
  },
  heading: {
    margin: theme.spacing.medium,
    marginLeft: theme.spacing.xLarge,
    marginTop: theme.spacing.large,
  },
  fareProductsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: theme.spacing.medium,
    alignItems: 'stretch',
  },
  fareProductsContainer__row: {
    paddingTop: theme.spacing.medium,
  },
}));
