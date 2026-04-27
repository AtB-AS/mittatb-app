import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {FareZonesTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {View} from 'react-native';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {
  FareZonesSelectorButtons,
  FareZonesSelectorMap,
} from '@atb/modules/fare-zones-selector';
import {useParamAsState} from '@atb/utils/use-param-as-state';
import {usePreviousZonesStore} from '@atb/modules/purchase-selection';

type Props = RootStackScreenProps<'Root_PurchaseFareZonesSearchByMapScreen'>;

export const Root_PurchaseFareZonesSearchByMapScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const [selection, setSelection] = useParamAsState(params.selection);
  const setPreviousZoneIds = usePreviousZonesStore((s) => s.setPreviousZoneIds);

  const selectionMode =
    selection.fareProductTypeConfig.configuration.zoneSelectionMode;
  const isApplicableOnSingleZoneOnly =
    selection.preassignedFareProduct.zoneSelectionMode?.includes('single') ||
    selectionMode.includes('single');

  const {t} = useTranslation();
  const styles = useMapStyles();

  const [selectNext, setSelectNext] = useState<'from' | 'to'>(
    isApplicableOnSingleZoneOnly ? 'from' : 'to',
  );

  const onSave = () => {
    if (selection.zones) {
      // Store the selected zones as the user's default for next purchase
      setPreviousZoneIds({
        from: selection.zones.from.id,
        to: selection.zones.to.id,
      });
    }
    navigation.popTo('Root_PurchaseOverviewScreen', {
      mode: 'Ticket',
      selection,
      onFocusElement: 'zones',
    });
  };

  const onVenueSearchClick = (fromOrTo: 'from' | 'to') =>
    navigation.navigate('Root_PurchaseFareZonesSearchByTextScreen', {
      fromOrTo,
      selection,
    });

  return (
    <View style={styles.container}>
      <FullScreenHeader
        showBorder={false}
        title={
          isApplicableOnSingleZoneOnly
            ? t(FareZonesTexts.header.title.singleZone)
            : t(FareZonesTexts.header.title.multipleZone)
        }
        leftButton={{type: 'back', onPress: onSave}}
      />

      <FareZonesSelectorButtons
        selection={selection}
        selectNext={selectNext}
        onVenueSearchClick={onVenueSearchClick}
        isApplicableOnSingleZoneOnly={isApplicableOnSingleZoneOnly}
        style={styles.selectorButtons}
      />

      <FareZonesSelectorMap
        selection={selection}
        selectNext={selectNext}
        isApplicableOnSingleZoneOnly={isApplicableOnSingleZoneOnly}
        onSelect={(selection) => {
          setSelection(selection);
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
  },
  saveButton: {
    marginHorizontal: theme.spacing.medium,
  },
  selectorButtons: {
    margin: theme.spacing.medium,
  },
}));
