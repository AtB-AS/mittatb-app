import {EstimatedCall, Quay} from '@atb/api/types/departures';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {
  StoredFavoriteDeparture,
  useFavoritesContext,
} from '@atb/modules/favorites';
import {StyleSheet} from '@atb/theme';
import {
  formatDestinationDisplay,
  getLineA11yLabel,
} from '@atb/screen-components/travel-details-screens';
import {
  DeparturesTexts,
  FavoriteDeparturesTexts,
  useTranslation,
} from '@atb/translations';
import React, {PropsWithChildren, type RefObject, useRef} from 'react';
import {View} from 'react-native';
import {
  GenericClickableSectionItem,
  SectionItemProps,
} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {getFavoriteIcon} from '@atb/modules/favorites';
import {LineChip} from '@atb/components/estimated-call';

type Props = PropsWithChildren<
  SectionItemProps<{
    quay: Quay;
    departure: EstimatedCall;
    onPressFavorite: (
      departure: EstimatedCall,
      existingFavorite: StoredFavoriteDeparture | undefined,
      onCloseRef: RefObject<any>,
    ) => void;
    testID?: string;
  }>
>;

export const FavoriteLineSectionItem = ({
  departure,
  quay,
  onPressFavorite,
  ...props
}: Props): React.JSX.Element => {
  const styles = useStyles();
  const {t} = useTranslation();
  const testID = 'lineItem';
  const onCloseRef = useRef<RefObject<any>>(null);
  const {getFavoriteDeparture} = useFavoritesContext();

  const existingFavorite = getFavoriteDeparture({
    quayId: quay.id,
    lineId: departure.serviceJourney.line.id,
    destinationDisplay: departure.destinationDisplay,
  });

  const onPress = () =>
    onPressFavorite(departure, existingFavorite, onCloseRef);

  const a11yLabel = [
    getLineA11yLabel(
      departure.destinationDisplay,
      departure.serviceJourney.line.publicCode,
      t,
    ),
    existingFavorite
      ? existingFavorite.destinationDisplay
        ? t(DeparturesTexts.favorites.favoriteButton.oneVariation)
        : t(DeparturesTexts.favorites.favoriteButton.allVariations)
      : '',
  ].join(screenReaderPause);

  const a11yHint = !!existingFavorite
    ? t(FavoriteDeparturesTexts.favoriteItemDelete.a11yHint)
    : t(FavoriteDeparturesTexts.favoriteItemAdd.a11yHint);

  const lineName = formatDestinationDisplay(t, departure.destinationDisplay);

  return (
    <GenericClickableSectionItem
      {...props}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint={a11yHint}
      importantForAccessibility="yes"
      ref={onCloseRef}
      testID={testID}
    >
      <View style={styles.container}>
        <View style={styles.transportInfo}>
          <LineChip serviceJourney={departure.serviceJourney} />
          <ThemeText style={styles.lineName} testID="lineName">
            {lineName}
          </ThemeText>
        </View>
        <ThemeIcon svg={getFavoriteIcon(existingFavorite)} />
      </View>
    </GenericClickableSectionItem>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    gap: theme.spacing.medium,
  },
  lineAndDepartureTime: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  transportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  lineName: {
    flexGrow: 1,
    flexShrink: 1,
    marginRight: theme.spacing.medium,
    minWidth: '30%',
  },
}));
