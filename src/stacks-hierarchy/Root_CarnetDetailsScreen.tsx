import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {useTicketingState} from '@atb/ticketing';
import {useTranslation, FareContractTexts} from '@atb/translations';
import {useInterval} from '@atb/utils/use-interval';
import React, {useState} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {CarnetDetailedView} from '@atb/fare-contracts';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';

export type CarnetDetailsRouteParams = {
  orderId: string;
  isInspectable: boolean;
};

type Props = RootStackScreenProps<'Root_CarnetDetailsScreen'>;

export function Root_CarnetDetailsScreen({navigation, route}: Props) {
  const styles = useStyles();
  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 2500);
  const {findFareContractByOrderId} = useTicketingState();
  const fc = findFareContractByOrderId(route?.params?.orderId);
  const {t} = useTranslation();

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
          <CarnetDetailedView
            fareContract={fc}
            now={now}
            onReceiptNavigate={onReceiptNavigate}
            isInspectable={route?.params?.isInspectable}
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
