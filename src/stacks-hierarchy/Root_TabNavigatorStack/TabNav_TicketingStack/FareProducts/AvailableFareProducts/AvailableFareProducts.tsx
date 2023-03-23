import {View} from 'react-native';
import {TicketingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {productIsSellableInApp} from '@atb/reference-data/utils';
import FareProductTile from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareProducts/AvailableFareProducts/FareProductTile';
import {FareProductTypeConfig} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/utils';
import TicketAssistantTile from '../../Assistant/TicketAssistantTile';
import {useTicketingAssistant} from '../../../../Root_TicketAssistantStack/use-ticketing-assistant';
import {useTipsAndInformation} from '../../../../Root_TipsAndInformation/use-tips-and-information';
import TipsAndInformationTile from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Assistant/TipsAndInformationTile';

export const AvailableFareProducts = ({
  navigation,
  onProductSelect,
}: {
  onProductSelect: (config: FareProductTypeConfig) => void;
  navigation: any;
}) => {
  const styles = useStyles();
  const {preassignedFareProducts, fareProductTypeConfigs} =
    useFirestoreConfiguration();
  const {t} = useTranslation();

  const sellableProductsInApp = preassignedFareProducts.filter(
    productIsSellableInApp,
  );

  const sellableFareProductTypeConfigs = fareProductTypeConfigs.filter(
    (config) => sellableProductsInApp.some((p) => p.type === config.type),
  );

  /*
  Group by two and two, as two fare products are shown side by side on each row
  in the purchase tab.
   */
  const groupedConfigs = sellableFareProductTypeConfigs.reduce<
    [FareProductTypeConfig, FareProductTypeConfig | undefined][]
  >((grouped, current, index, arr) => {
    if (index % 2 === 0) return [...grouped, [current, arr[index + 1]]];
    return grouped;
  }, []);

  const showTipsAndInformation = useTipsAndInformation();
  const showTicketAssistant = useTicketingAssistant();

  return (
    <View style={styles.container}>
      {showTipsAndInformation && (
        <TipsAndInformationTile
          onPress={() => {
            console.log('tips and info pressed');
            navigation.navigate('Root_TipsAndInformation');
          }}
          testID="tipsAndInformation"
        />
      )}

      <ThemeText type="body__secondary" style={styles.heading}>
        {t(TicketingTexts.availableFareProducts.allTickets)}
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
      {showTicketAssistant && (
        <TicketAssistantTile
          onPress={() => {
            console.log('ticketAssistant pressed');
            navigation.navigate('Root_TicketAssistantStack');
          }}
          testID="ticketAssistant"
        />
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingBottom: theme.spacings.medium,
  },
  heading: {
    margin: theme.spacings.medium,
    marginLeft: theme.spacings.xLarge,
  },
  fareProductsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
    alignItems: 'stretch',
  },
}));
