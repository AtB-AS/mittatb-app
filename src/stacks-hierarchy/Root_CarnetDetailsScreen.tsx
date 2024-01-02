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

type Props = RootStackScreenProps<'Root_CarnetDetailsScreen'>;

export function Root_CarnetDetailsScreen({navigation, route}: Props) {
  const styles = useStyles();
  const now = useNow(2500);
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
