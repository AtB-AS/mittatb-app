import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {TicketingStackParams} from '../';
import Header from '../../../../ScreenHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet} from '../../../../theme';
import ThemeText from '../../../../components/text';
import {DismissableStackNavigationProp} from '../../../../navigation/createDismissableStackNavigator';
import {ButtonInput, Section} from '../../../../components/sections';
import {screenReaderPause} from '../../../../components/accessible-text';
import {TariffZonesTexts, useTranslation} from '../../../../translations';

type TariffZonesRouteName = 'TariffZones';
const TariffZonesRouteNameStatic: TariffZonesRouteName = 'TariffZones';

type RouteProps = RouteProp<TicketingStackParams, TariffZonesRouteName>;
type NavigationProps = DismissableStackNavigationProp<
  TicketingStackParams,
  TariffZonesRouteName
>;

export type TariffZonesProps = {
  navigation: NavigationProps;
  route: RouteProps;
};

const TariffZonesRoot: React.FC<TariffZonesProps> = ({navigation, route}) => {
  return <TariffZones navigation={navigation} route={route} />;
};

type Props = {
  navigation: NavigationProps;
  route: RouteProps;
};

const TariffZones: React.FC<Props> = ({navigation, route}) => {
  const styles = useStyles();

  const {t} = useTranslation();

  const {fromTariffZone, toTariffZone, preassignedFareProduct} = route.params;

  const openTariffZoneSearch = (callerRouteParam: keyof RouteProps['params']) =>
    navigation.navigate('TariffZoneSearch', {
      label:
        callerRouteParam === 'fromTariffZone'
          ? t(TariffZonesTexts.location.departurePicker.label)
          : t(TariffZonesTexts.location.destinationPicker.label),
      callerRouteName: TariffZonesRouteNameStatic,
      callerRouteParam,
    });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t(TariffZonesTexts.header.title)}
        leftButton={{
          icon: <ThemeText>{t(TariffZonesTexts.header.leftButton)}</ThemeText>,
          onPress: () =>
            navigation.navigate('Travellers', {
              fromTariffZone,
              toTariffZone,
              preassignedFareProduct,
            }),
        }}
        style={styles.header}
      />

      <Section withPadding>
        <ButtonInput
          accessibilityLabel={
            t(TariffZonesTexts.location.departurePicker.a11yLabel) +
            screenReaderPause
          }
          accessibilityHint={
            t(TariffZonesTexts.location.departurePicker.a11yHint) +
            screenReaderPause
          }
          value={fromTariffZone?.name.value}
          label={t(TariffZonesTexts.location.departurePicker.label)}
          placeholder={t(TariffZonesTexts.location.departurePicker.label)}
          onPress={() => openTariffZoneSearch('fromTariffZone')}
        />

        <ButtonInput
          accessibilityLabel={
            TariffZonesTexts.location.destinationPicker.a11yLabel +
            screenReaderPause
          }
          accessibilityHint={
            TariffZonesTexts.location.destinationPicker.a11yHint +
            screenReaderPause
          }
          value={toTariffZone?.name.value}
          label={t(TariffZonesTexts.location.destinationPicker.label)}
          placeholder={t(TariffZonesTexts.location.destinationPicker.label)}
          onPress={() => openTariffZoneSearch('toTariffZone')}
        />
      </Section>
    </SafeAreaView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.level2,
  },
  header: {
    paddingHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
}));

export default TariffZonesRoot;
