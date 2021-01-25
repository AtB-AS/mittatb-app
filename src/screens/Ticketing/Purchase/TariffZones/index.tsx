import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {TicketingStackParams} from '../';
import Header from '../../../../ScreenHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet, useTheme} from '../../../../theme';
import {DismissableStackNavigationProp} from '../../../../navigation/createDismissableStackNavigator';
import {ButtonInput, Section} from '../../../../components/sections';
import AccessibleText, {
  screenReaderPause,
} from '../../../../components/accessible-text';
import {TariffZonesTexts, useTranslation} from '../../../../translations';
import {View} from 'react-native';
import ThemeIcon from '../../../../components/theme-icon';
import {ArrowLeft} from '../../../../assets/svg/icons/navigation';
import Button from '../../../../components/button';
import {Confirm} from '../../../../assets/svg/icons/actions';
import {TariffZone} from '../../../../reference-data/types';

type TariffZonesRouteName = 'TariffZones';
const TariffZonesRouteNameStatic: TariffZonesRouteName = 'TariffZones';

type RouteProps = RouteProp<TicketingStackParams, TariffZonesRouteName>;
type NavigationProps = DismissableStackNavigationProp<
  TicketingStackParams,
  TariffZonesRouteName
>;

export type TariffZoneWithMetadata = TariffZone & {
  resultType: 'venue' | 'geolocation' | 'zone';
  venueName?: string;
};

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

export const tariffZonesSummary = (
  fromTariffZone: TariffZoneWithMetadata,
  toTariffZone: TariffZoneWithMetadata,
) => {
  if (fromTariffZone.id === toTariffZone.id) {
    return TariffZonesTexts.zoneSummary.text.singleZone(
      fromTariffZone.name.value,
    );
  } else {
    return TariffZonesTexts.zoneSummary.text.multipleZone(
      fromTariffZone.name.value,
      toTariffZone.name.value,
    );
  }
};

const departurePickerAccessibilityLabel = (
  fromTariffZone: TariffZoneWithMetadata,
) => {
  if (fromTariffZone.venueName)
    return TariffZonesTexts.location.departurePicker.a11yLabel.withVenue(
      fromTariffZone.name.value,
      fromTariffZone.venueName,
    );
  else {
    return TariffZonesTexts.location.departurePicker.a11yLabel.noVenue(
      fromTariffZone.name.value,
    );
  }
};

const destinationPickerAccessibilityLabel = (
  toTariffZone: TariffZoneWithMetadata,
) => {
  if (toTariffZone.venueName)
    return TariffZonesTexts.location.destinationPicker.a11yLabel.withVenue(
      toTariffZone.name.value,
      toTariffZone.venueName,
    );
  else {
    return TariffZonesTexts.location.destinationPicker.a11yLabel.noVenue(
      toTariffZone.name.value,
    );
  }
};

const departurePickerValue = (fromTariffZone: TariffZoneWithMetadata) => {
  if (fromTariffZone.venueName)
    return TariffZonesTexts.location.departurePicker.value.withVenue(
      fromTariffZone.name.value,
      fromTariffZone.venueName,
    );
  else {
    return TariffZonesTexts.location.departurePicker.value.noVenue(
      fromTariffZone.name.value,
    );
  }
};

const destinationPickerValue = (
  fromTariffZone: TariffZoneWithMetadata,
  toTariffZone: TariffZoneWithMetadata,
) => {
  if (fromTariffZone.id === toTariffZone.id && toTariffZone.venueName) {
    return TariffZonesTexts.location.destinationPicker.value.withVenueSameZone(
      toTariffZone.venueName,
    );
  } else if (fromTariffZone.id === toTariffZone.id && !toTariffZone.venueName) {
    return TariffZonesTexts.location.destinationPicker.value.noVenueSameZone;
  } else if (toTariffZone.venueName) {
    return TariffZonesTexts.location.departurePicker.value.withVenue(
      toTariffZone.name.value,
      toTariffZone.venueName,
    );
  } else {
    return TariffZonesTexts.location.departurePicker.value.noVenue(
      toTariffZone.name.value,
    );
  }
};

const TariffZones: React.FC<Props> = ({navigation, route}) => {
  const styles = useStyles();
  const {theme} = useTheme();

  const {t} = useTranslation();

  const {fromTariffZone, toTariffZone} = route.params;

  const openTariffZoneSearch = (
    callerRouteParam: keyof RouteProps['params'],
    initialLocation?: string,
  ) =>
    navigation.navigate('TariffZoneSearch', {
      label:
        callerRouteParam === 'fromTariffZone'
          ? t(TariffZonesTexts.location.departurePicker.label)
          : t(TariffZonesTexts.location.destinationPicker.label),
      callerRouteName: TariffZonesRouteNameStatic,
      callerRouteParam,
      initialLocation,
    });

  const {top: safeAreaTop, bottom: safeAreBottom} = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: safeAreaTop}]}>
      <View>
        <Header
          title={t(TariffZonesTexts.header.title)}
          leftButton={{
            accessible: true,
            accessibilityRole: 'button',
            accessibilityLabel: t(TariffZonesTexts.header.leftButton.a11yLabel),
            icon: <ThemeIcon svg={ArrowLeft} />,
            onPress: () => navigation.goBack(),
          }}
          style={styles.header}
        />

        <Section withPadding>
          <ButtonInput
            accessibilityLabel={
              t(departurePickerAccessibilityLabel(fromTariffZone)) +
              screenReaderPause
            }
            accessibilityHint={t(
              TariffZonesTexts.location.departurePicker.a11yHint,
            )}
            accessibilityRole="button"
            value={t(departurePickerValue(fromTariffZone))}
            label={t(TariffZonesTexts.location.departurePicker.label)}
            placeholder={t(TariffZonesTexts.location.departurePicker.label)}
            onPress={() =>
              openTariffZoneSearch('fromTariffZone', fromTariffZone.venueName)
            }
          />

          <ButtonInput
            accessibilityLabel={
              t(destinationPickerAccessibilityLabel(toTariffZone)) +
              screenReaderPause
            }
            accessibilityHint={t(
              TariffZonesTexts.location.destinationPicker.a11yHint,
            )}
            accessibilityRole="button"
            value={t(destinationPickerValue(fromTariffZone, toTariffZone))}
            label={t(TariffZonesTexts.location.destinationPicker.label)}
            placeholder={t(TariffZonesTexts.location.destinationPicker.label)}
            onPress={() =>
              openTariffZoneSearch('toTariffZone', toTariffZone.venueName)
            }
          />
        </Section>
        <AccessibleText
          type={'body'}
          style={styles.tariffZoneText}
          prefix={t(TariffZonesTexts.zoneSummary.a11yLabelPrefix)}
        >
          {t(tariffZonesSummary(fromTariffZone, toTariffZone))}
        </AccessibleText>
      </View>
      <View
        style={{
          paddingBottom: Math.max(safeAreBottom, theme.spacings.medium),
        }}
      >
        <Button
          style={styles.saveButton}
          onPress={() =>
            navigation.navigate('PurchaseOverview', {
              fromTariffZone,
              toTariffZone,
            })
          }
          text={t(TariffZonesTexts.saveButton.text)}
          accessibilityHint={t(TariffZonesTexts.saveButton.a11yHint)}
          icon={Confirm}
          iconPosition="right"
        />
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.level2,
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  tariffZoneText: {
    textAlign: 'center',
    marginTop: theme.spacings.medium,
  },
  saveButton: {
    marginHorizontal: theme.spacings.medium,
  },
}));

export default TariffZonesRoot;
