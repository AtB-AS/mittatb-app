import {StyleSheet, useTheme} from '@atb/theme';

import {View} from 'react-native';
import {screenReaderPause} from '@atb/components/text';
import React from 'react';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {TicketMultiple} from '@atb/assets/svg/mono-icons/ticketing';
import {FareProductTypeConfig} from '@atb-as/config-specs';
import {useFirestoreConfiguration} from '@atb/configuration';
import {isProductSellableInApp} from '@atb/reference-data/utils';
import {useTicketingState} from '@atb/ticketing';
import {TicketingTile} from '../TicketingTile';

type TicketAssistantProps = {
  accented?: boolean;
  onPress: (preassignedFareProduct: FareProductTypeConfig) => void;
  testID: string;
};
export const TicketAssistantTile: React.FC<TicketAssistantProps> = ({
  accented,
  onPress,
  testID,
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useTheme();

  const title = t(TicketingTexts.ticketAssistantTile.title);
  const description = t(TicketingTexts.ticketAssistantTile.description);

  const accessibilityLabel = [title, 'Beta', description].join(
    screenReaderPause,
  );

  const {fareProductTypeConfigs, preassignedFareProducts} =
    useFirestoreConfiguration();
  const {customerProfile} = useTicketingState();

  const sellableProductsInApp = preassignedFareProducts.filter((product) =>
    isProductSellableInApp(product, customerProfile),
  );

  const sellableFareProductTypeConfigs = fareProductTypeConfigs.filter(
    (config) => sellableProductsInApp.some((p) => p.type === config.type),
  );

  const requiresLoginConfig = sellableFareProductTypeConfigs.find(
    (config) => config.configuration.requiresLogin,
  );

  if (!requiresLoginConfig) {
    return <View style={{height: theme.spacings.medium}} />;
  } else {
    return (
      <View style={styles.tipsAndInformation}>
        <TicketingTile
          accented={accented}
          onPress={() => onPress(requiresLoginConfig)}
          testID={testID}
          transportColor="transport_other"
          title={title}
          description={description}
          accessibilityLabel={accessibilityLabel}
          showBetaTag={true}
        >
          <TicketMultiple style={styles.illustration} />
        </TicketingTile>
      </View>
    );
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  tipsAndInformation: {
    flexShrink: 1,
    alignSelf: 'stretch',
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.large,
  },
  illustration: {
    marginTop: theme.spacings.small,
  },
}));
