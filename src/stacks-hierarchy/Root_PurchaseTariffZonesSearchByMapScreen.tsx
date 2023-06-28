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
    setSelectedZones({
      ...selectedZones,
      from: fromTariffZone,
    });
  }, [fromTariffZone]);

  useEffect(() => {
    setSelectedZones({
      ...selectedZones,
      to: toTariffZone,
    });
  }, [toTariffZone]);

  const onSave = () => {
    navigation.navigate({
      name: 'Root_PurchaseOverviewScreen',
      params: {
        mode: 'Ticket',
        fareProductTypeConfig,
        fromTariffZone: selectedZones.from,
        setA11yFocusToZonesSelection: true,
        toTariffZone: isApplicableOnSingleZoneOnly
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
    backgroundColor: theme.static.background.background_2.background,
  },
  headerContainer: {
    backgroundColor: theme.static.background.background_accent_0.background,
  },
  saveButton: {
    marginHorizontal: theme.spacings.medium,
  },
  selectorButtons: {
    margin: theme.spacings.medium,
  },
}));
