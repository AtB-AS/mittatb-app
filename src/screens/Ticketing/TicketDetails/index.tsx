import React from 'react';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../../navigation';
import Header from '../../../ScreenHeader';
import {StyleSheet} from '../../../theme';
import ThemeIcon from '../../../components/theme-icon';
import {Close} from '../../../assets/svg/icons/actions';
import ThemeText from '../../../components/text';
import {SafeAreaView} from 'react-native-safe-area-context';

export type TicketDetailsRouteParams = {
  orderId: string;
};

export type TicketDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'TicketDetails'
>;

export type TicketDetailsScreenNavigationProp = NavigationProp<
  RootStackParamList
>;

type Props = {
  route: TicketDetailsScreenRouteProp;
  navigation: TicketDetailsScreenNavigationProp;
};

export default function TicketDetails({navigation, route}: Props) {
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftButton={{
          onPress: () => navigation.goBack(),
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: 'Gå tilbake',
          icon: <ThemeIcon svg={Close} />,
        }}
        title="Reisedetaljer"
        style={styles.header}
      />
      <ThemeText>{route.params.orderId}</ThemeText>
    </SafeAreaView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    backgroundColor: theme.background.level2,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background.level2,
  },
}));
