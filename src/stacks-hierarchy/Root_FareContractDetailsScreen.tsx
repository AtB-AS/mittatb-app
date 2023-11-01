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
import {useInterval} from '@atb/utils/use-interval';
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {RootStackScreenProps} from '../stacks-hierarchy/navigation-types';

type Props = RootStackScreenProps<'Root_FareContractDetailsScreen'>;

export function Root_FareContractDetailsScreen({navigation, route}: Props) {
  const styles = useStyles();
  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 2500);
  const {findFareContractByOrderId, customerProfile} = useTicketingState();
  const fc = findFareContractByOrderId(route?.params?.orderId);
  const firstTravelRight = fc?.travelRights[0];
  const {t} = useTranslation();

  useApplePassPresentationSuppression();

  const {preassignedFareProducts} = useFirestoreConfiguration();
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    isOfFareProductRef(firstTravelRight) ? firstTravelRight.fareProductRef : '',
  );

  const hasActiveTravelCard = !!customerProfile?.travelcard;

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
        title={t(FareContractTexts.details.header.title)}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {fc && (
          <DetailsContent
            fareContract={fc}
            preassignedFareProduct={preassignedFareProduct}
            now={now}
            onReceiptNavigate={onReceiptNavigate}
            hasActiveTravelCard={hasActiveTravelCard}
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
