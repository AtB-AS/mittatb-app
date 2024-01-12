import {FullScreenHeader} from '@atb/components/screen-header';
import {DetailsContent} from '@atb/fare-contracts';
import {
  findReferenceDataById,
  isOfFareProductRef,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {useApplePassPresentationSuppression} from '@atb/suppress-pass-presentation';
import {StyleSheet} from '@atb/theme';
import {useTicketingState} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {RootStackScreenProps} from '../stacks-hierarchy/navigation-types';
import {useTimeContextState} from '@atb/time';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useAnalytics} from '@atb/analytics';

type Props = RootStackScreenProps<'Root_FareContractDetailsScreen'>;

export function Root_FareContractDetailsScreen({navigation, route}: Props) {
  const styles = useStyles();
  const {serverNow} = useTimeContextState();
  const {findFareContractByOrderId} = useTicketingState();
  const fc = findFareContractByOrderId(route?.params?.orderId);
  const firstTravelRight = fc?.travelRights[0];
  const {t} = useTranslation();
  const {enable_ticket_information} = useRemoteConfig();
  const analytics = useAnalytics();

  useApplePassPresentationSuppression();

  const {preassignedFareProducts} = useFirestoreConfiguration();
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    isOfFareProductRef(firstTravelRight) ? firstTravelRight.fareProductRef : '',
  );

  const onReceiptNavigate = () =>
    fc &&
    navigation.push('Root_ReceiptScreen', {
      orderId: fc.orderId,
      orderVersion: fc.version,
    });

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

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'close'}}
        rightButton={
          enable_ticket_information
            ? {type: 'info', onPress: onPressInfo, color:'background_accent_0'}
            : undefined
        }
        title={t(FareContractTexts.details.header.title)}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {fc && (
          <DetailsContent
            fareContract={fc}
            preassignedFareProduct={preassignedFareProduct}
            now={serverNow}
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
