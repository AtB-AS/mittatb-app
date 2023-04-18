import {MessageBox} from '@atb/components/message-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {findReferenceDataById} from '@atb/reference-data/utils';
import {StyleSheet} from '@atb/theme';
import {isPreActivatedTravelRight, useTicketingState} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {useInterval} from '@atb/utils/use-interval';
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {DetailsContent, getValidityStatus} from '@atb/fare-contracts';
import {getValidOnTrainNoticeText} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/utils';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';

export type FareContractDetailsRouteParams = {
  orderId: string;
};

type Props = RootStackScreenProps<'Root_FareContractDetailsScreen'>;

function isOfFareProductRef(a: any): a is {fareProductRef: string} {
  return 'fareProductRef' in a;
}

export function Root_FareContractDetailsScreen({navigation, route}: Props) {
  const styles = useStyles();
  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 2500);
  const {findFareContractByOrderId, customerProfile} = useTicketingState();
  const fc = findFareContractByOrderId(route?.params?.orderId);
  const firstTravelRight = fc?.travelRights[0];
  const {t} = useTranslation();

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

  const shouldShowValidOnTrainNotice: boolean =
    fc !== undefined &&
    isPreActivatedTravelRight(firstTravelRight) &&
    getValidityStatus(
      now,
      firstTravelRight.startDateTime.toMillis(),
      firstTravelRight.endDateTime.toMillis(),
      fc.state,
    ) === 'valid' &&
    firstTravelRight.tariffZoneRefs?.every(
      (val: string) => val === 'ATB:TariffZone:1',
    ) === true;

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

        {shouldShowValidOnTrainNotice && (
          <MessageBox
            message={getValidOnTrainNoticeText(t, preassignedFareProduct?.type)}
            type="info"
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
