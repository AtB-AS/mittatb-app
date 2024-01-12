import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {useTicketingState} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {CarnetDetailedView} from '@atb/fare-contracts';
import {RootStackScreenProps} from '../stacks-hierarchy/navigation-types';
import {useNow} from '@atb/utils/use-now';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useAnalytics} from '@atb/analytics';
import {
  findReferenceDataById,
  isOfFareProductRef,
  useFirestoreConfiguration,
} from '@atb/configuration';

type Props = RootStackScreenProps<'Root_CarnetDetailsScreen'>;

export function Root_CarnetDetailsScreen({navigation, route}: Props) {
  const styles = useStyles();
  const now = useNow(2500);
  const {findFareContractByOrderId} = useTicketingState();
  const fc = findFareContractByOrderId(route?.params?.orderId);
  const firstTravelRight = fc?.travelRights[0];
  const {t} = useTranslation();
  const {enable_ticket_information} = useRemoteConfig();
  const analytics = useAnalytics();

  const {preassignedFareProducts} = useFirestoreConfiguration();
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    isOfFareProductRef(firstTravelRight) ? firstTravelRight.fareProductRef : '',
  );

  const ticketInfoParams = preassignedFareProduct && {
    fareProductTypeConfigType: preassignedFareProduct?.type,
    preassignedFareProductId: preassignedFareProduct?.id,
  };

  const onPressInfo = () => {
    ticketInfoParams &&
      navigation.navigate('Root_TicketInformationScreen', ticketInfoParams);
    ticketInfoParams &&
      analytics.logEvent(
        'Ticketing',
        'Ticket information button clicked',
        ticketInfoParams,
      );
  };

  const onReceiptNavigate = () =>
    fc &&
    navigation.push('Root_ReceiptScreen', {
      orderId: fc.orderId,
      orderVersion: fc.version,
    });

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'close'}}
        rightButton={
          enable_ticket_information
            ? {type: 'info', onPress: onPressInfo, color: 'background_accent_0'}
            : undefined
        }
        title={t(FareContractTexts.details.header.title)}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {fc && (
          <CarnetDetailedView
            fareContract={fc}
            now={now}
            onReceiptNavigate={onReceiptNavigate}
          />
        )}
      </ScrollView>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_2.background,
  },
  content: {
    padding: theme.spacings.medium,
    paddingBottom: theme.spacings.xLarge,
  },
}));
