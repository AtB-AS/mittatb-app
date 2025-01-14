import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {TariffZonesTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {View} from 'react-native';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {
  TariffZonesSelectorButtons,
  TariffZonesSelectorMap,
} from '@atb/tariff-zones-selector';

type Props = RootStackScreenProps<'Root_PurchaseTariffZonesSearchByMapScreen'>;

export const Root_PurchaseTariffZonesSearchByMapScreen = ({
  navigation,
  route,
}: Props) => {
  const {selection} = route.params;
  const selectionMode =
    selection.fareProductTypeConfig.configuration.zoneSelectionMode;
  const isApplicableOnSingleZoneOnly =
    selection.preassignedFareProduct.zoneSelectionMode?.includes('single') ||
    selectionMode === 'single';

  const {t} = useTranslation();
  const styles = useMapStyles();

  const [selectNext, setSelectNext] = useState<'from' | 'to'>(
    isApplicableOnSingleZoneOnly ? 'from' : 'to',
  );

  const onSave = () =>
    navigation.navigate('Root_PurchaseOverviewScreen', {
      mode: 'Ticket',
      selection,
      onFocusElement: 'zones',
    });

  const onVenueSearchClick = (fromOrTo: 'from' | 'to') =>
    navigation.navigate('Root_PurchaseTariffZonesSearchByTextScreen', {
      fromOrTo,
      selection,
    });

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
          selection={selection}
          selectNext={selectNext}
          onVenueSearchClick={onVenueSearchClick}
          isApplicableOnSingleZoneOnly={isApplicableOnSingleZoneOnly}
          style={styles.selectorButtons}
        />
      </View>

      <TariffZonesSelectorMap
        selection={selection}
        selectNext={selectNext}
        isApplicableOnSingleZoneOnly={isApplicableOnSingleZoneOnly}
        onSelect={(selection) => {
          navigation.setParams({selection});
          setSelectNext((prev) =>
            isApplicableOnSingleZoneOnly
              ? 'from'
              : prev === 'from'
              ? 'to'
              : 'from',
          );
        }}
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
