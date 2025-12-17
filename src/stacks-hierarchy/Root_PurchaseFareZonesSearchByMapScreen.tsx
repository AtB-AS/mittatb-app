import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {FareZonesTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {View} from 'react-native';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {
  FareZonesSelectorButtons,
  FareZonesSelectorMap,
} from '@atb/fare-zones-selector';
import {useParamAsState} from '@atb/utils/use-param-as-state';

type Props = RootStackScreenProps<'Root_PurchaseFareZonesSearchByMapScreen'>;

export const Root_PurchaseFareZonesSearchByMapScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const [selection, setSelection] = useParamAsState(params.selection);

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

  const onSave = () =>
    navigation.popTo('Root_PurchaseOverviewScreen', {
      mode: 'Ticket',
      selection,
      onFocusElement: 'zones',
    });

  const onVenueSearchClick = (fromOrTo: 'from' | 'to') =>
    navigation.navigate('Root_PurchaseFareZonesSearchByTextScreen', {
      fromOrTo,
      selection,
    });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <FullScreenHeader
          title={
            isApplicableOnSingleZoneOnly
              ? t(FareZonesTexts.header.title.singleZone)
              : t(FareZonesTexts.header.title.multipleZone)
          }
          leftButton={{type: 'back'}}
        />

        <FareZonesSelectorButtons
          selection={selection}
          selectNext={selectNext}
          onVenueSearchClick={onVenueSearchClick}
          isApplicableOnSingleZoneOnly={isApplicableOnSingleZoneOnly}
          style={styles.selectorButtons}
        />
      </View>

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
