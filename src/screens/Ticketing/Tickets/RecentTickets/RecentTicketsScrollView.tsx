import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {RootStackParamList} from '@atb/navigation';
import {StyleSheet, useTheme} from '@atb/theme';
import {TicketsTexts, useTranslation} from '@atb/translations';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View} from 'react-native';
import {TicketingStackParams} from '../../Purchase';
import useRecentTickets, {RecentTicket} from '../use-recent-tickets';
import {NewRecentTickets} from './NewRecentTickets';

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<TicketingStackParams>,
  StackNavigationProp<RootStackParamList>
>;

type RecentTicketsProps = {
  topElement?: JSX.Element;
};

const RecentTicketsScrollView = ({topElement}: RecentTicketsProps) => {
  const {theme} = useTheme();
  const styles = useStyles();
  const navigation = useNavigation<NavigationProp>();
  const {recentTickets, loading, refresh} = useRecentTickets();
  const {t} = useTranslation();

  const selectTicket = (ticket: RecentTicket) => {
    navigation.navigate('TicketPurchase', {
      screen: 'Confirmation',
      params: {
        ...ticket,
        headerLeftButton: {type: 'cancel'},
      },
    });
  };

  return (
    <View style={styles.container}>
      {!!recentTickets?.length && <NewRecentTickets navigation={navigation} />}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    marginVertical: theme.spacings.medium,
    marginHorizontal: theme.spacings.xSmall,
  },
  scrollView: {},
  noTicketsText: {
    textAlign: 'center',
  },
  ticketInfoButton: {flex: 1},
  gradient: {position: 'absolute', bottom: 0, width: '100%', height: 30},
}));

export default RecentTicketsScrollView;
