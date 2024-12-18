import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {TariffZonesTexts, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {
  Root_PurchaseTariffZonesSearchByMapScreenParams,
  RootStackScreenProps,
} from '@atb/stacks-hierarchy/navigation-types';
import {
  TariffZonesSelectorButtons,
  TariffZonesSelectorMap,
  TariffZoneSelection,
} from '@atb/tariff-zones-selector';

type Props = RootStackScreenProps<'Root_PurchaseTariffZonesSearchByMapScreen'>;

export const Root_PurchaseTariffZonesSearchByMapScreen = ({
  navigation,
  route,
}: Props) => {
  const {
    fromTariffZone,
    toTariffZone,
    fareProductTypeConfig,
    preassignedFareProduct,
  } = route.params;
  const selectionMode = fareProductTypeConfig.configuration.zoneSelectionMode;
  const isApplicableOnSingleZoneOnly =
    preassignedFareProduct.zoneSelectionMode?.includes('single') ||
    selectionMode === 'single';
  const [selectedZones, setSelectedZones] = useState<TariffZoneSelection>({
    from: fromTariffZone,
    to: toTariffZone,
    selectNext: isApplicableOnSingleZoneOnly ? 'from' : 'to',
  });
  const {t} = useTranslation();

  useEffect(() => {
    setSelectedZones((prev) => ({
      ...prev,
      from: fromTariffZone,
    }));
  }, [fromTariffZone]);

  useEffect(() => {
    setSelectedZones((prev) => ({
      ...prev,
      to: toTariffZone,
    }));
  }, [toTariffZone]);

  const onSave = () => {
    navigation.navigate({
      name: 'Root_PurchaseOverviewScreen',
      params: {
        mode: 'Ticket',
        fareProductTypeConfig,
        fromPlace: selectedZones.from,
        onFocusElement: 'zones',
        toPlace: isApplicableOnSingleZoneOnly
          ? selectedZones.from
          : selectedZones.to,
      },
      merge: true,
    });
  };

  const styles = useMapStyles();

  const onVenueSearchClick = (
    callerRouteParam: keyof Root_PurchaseTariffZonesSearchByMapScreenParams,
  ) => {
    navigation.navigate({
      name: 'Root_PurchaseTariffZonesSearchByTextScreen',
      params: {
        label:
          callerRouteParam === 'fromTariffZone'
            ? t(TariffZonesTexts.location.zonePicker.labelFrom)
            : t(TariffZonesTexts.location.zonePicker.labelTo),
        callerRouteName: route.name,
        callerRouteParam,
      },
      merge: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <FullScreenHeader
          title={
            isApplicableOnSingleZoneOnly
              ? t(TariffZonesTexts.header.title.singleZone)
              : t(TariffZonesTexts.header.title.multipleZone)
          }
          leftButton={{type: 'back'}}
        />

        <TariffZonesSelectorButtons
          selectedZones={selectedZones}
          onVenueSearchClick={onVenueSearchClick}
          isApplicableOnSingleZoneOnly={isApplicableOnSingleZoneOnly}
          style={styles.selectorButtons}
        />
      </View>

      <TariffZonesSelectorMap
        selectedZones={selectedZones}
        isApplicableOnSingleZoneOnly={isApplicableOnSingleZoneOnly}
        setSelectedZones={setSelectedZones}
        onSave={onSave}
      />
    </View>
  );
};

const useMapStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[2].background,
  },
  headerContainer: {
    backgroundColor: theme.color.background.accent[0].background,
  },
  saveButton: {
    marginHorizontal: theme.spacing.medium,
  },
  selectorButtons: {
    margin: theme.spacing.medium,
  },
}));
