import {MessageBox} from '@atb/components/message-box';
import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';
import {RootStackParamList} from '@atb/stacks-hierarchy';
import FareContractOrReservation from '@atb/fare-contracts/FareContractOrReservation';
import {StyleSheet, useTheme} from '@atb/theme';
import {FareContract, Reservation, TravelCard} from '@atb/ticketing';
import TravelTokenBox from '@atb/travel-token-box';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import hexToRgba from 'hex-to-rgba';
import React, {useMemo} from 'react';
import {RefreshControl, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import TravelCardInformation from '../stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/Components/TravelCardInformation';

type RootNavigationProp = NavigationProp<RootStackParamList>;

type Props = {
  reservations?: Reservation[];
  fareContracts?: FareContract[];
  noItemsLabel: string;
  isRefreshing: boolean;
  refresh: () => void;
  now: number;
  travelCard?: TravelCard;
  showTokenInfo?: boolean;
};

export const FareContractAndReservationsList: React.FC<Props> = ({
  fareContracts,
  reservations,
  noItemsLabel,
  isRefreshing,
  refresh,
  now,
  travelCard,
  showTokenInfo,
}) => {
  const {theme} = useTheme();
  const styles = useStyles();
  const navigation = useNavigation<RootNavigationProp>();
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const hasActiveTravelCard = !!travelCard;

  const fareContractsAndReservationsSorted = useMemo(() => {
    return [...(fareContracts || []), ...(reservations || [])].sort(
      (a, b) => b.created.toMillis() - a.created.toMillis(),
    );
  }, [reservations, fareContracts]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
      >
        {showTokenInfo &&
          (hasEnabledMobileToken ? (
            <TravelTokenBox
              showIfThisDevice={false}
              showHowToChangeHint={true}
            />
          ) : hasActiveTravelCard ? (
            <TravelCardInformation travelCard={travelCard} />
          ) : null)}
        {!fareContractsAndReservationsSorted.length && (
          <MessageBox
            style={styles.messageBox}
            type="info"
            message={noItemsLabel}
          />
        )}
        {fareContractsAndReservationsSorted?.map((fcOrReservation, index) => (
          <FareContractOrReservation
            now={now}
            onPressFareContract={() =>
              navigation.navigate('FareContractModal', {
                screen: 'FareContractDetails',
                params: {orderId: fcOrReservation.orderId},
              })
            }
            key={fcOrReservation.orderId}
            fcOrReservation={fcOrReservation}
            index={index}
          />
        ))}
      </ScrollView>
      <LinearGradient
        style={{position: 'absolute', bottom: 0, width: '100%', height: 30}}
        colors={[
          hexToRgba(theme.static.background.background_1.background, 0.1),
          hexToRgba(theme.static.background.background_1.background, 1),
        ]}
        pointerEvents={'none'}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1, marginBottom: theme.spacings.small},
  scrollView: {flex: 1, padding: theme.spacings.medium},
  gradient: {
    backgroundColor: theme.static.background.background_1.background,
  },
  messageBox: {
    marginBottom: theme.spacings.large,
  },
}));
