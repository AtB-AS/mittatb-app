import React from 'react';
import {RefreshControl, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {StyleSheet, useTheme} from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import hexToRgba from 'hex-to-rgba';
import ThemeText from '../../../components/text';
import useRecentTickets, {RecentTicket} from './use-recent-tickets';
import * as Sections from '../../../components/sections';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../navigation';
import {TicketingStackParams} from '../Purchase';
import {TicketInfoView} from '../Ticket/TicketInfo';
import {TicketsTexts, useTranslation} from '../../../translations';

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<TicketingStackParams>,
  StackNavigationProp<RootStackParamList>
>;

const RecentTicketsScrollView = () => {
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
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        {!recentTickets?.length && loading && (
          <ThemeText style={styles.noTicketsText}>
            {t(TicketsTexts.recentTickets.loading)}
          </ThemeText>
        )}
        {!!recentTickets?.length && (
          <Sections.Section>
            <Sections.GenericItem>
              <View>
                <ThemeText>{t(TicketsTexts.recentTickets.title)}</ThemeText>
              </View>
            </Sections.GenericItem>
            {recentTickets.map((ticket, index) => (
              <Sections.GenericItem key={'ticket' + index}>
                <TouchableOpacity
                  onPress={() => selectTicket(ticket)}
                  accessibilityHint={t(TicketsTexts.recentTickets.a11yHint)}
                  accessibilityRole={'button'}
                >
                  <TicketInfoView {...ticket} />
                </TouchableOpacity>
              </Sections.GenericItem>
            ))}
          </Sections.Section>
        )}
      </ScrollView>
      <LinearGradient
        style={styles.gradient}
        colors={[
          hexToRgba(theme.background.level1, 0.1),
          hexToRgba(theme.background.level1, 1),
        ]}
        pointerEvents={'none'}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1, marginBottom: theme.spacings.small},
  scrollView: {flex: 1, padding: theme.spacings.medium},
  noTicketsText: {
    textAlign: 'center',
  },
  gradient: {position: 'absolute', bottom: 0, width: '100%', height: 30},
}));

export default RecentTicketsScrollView;
