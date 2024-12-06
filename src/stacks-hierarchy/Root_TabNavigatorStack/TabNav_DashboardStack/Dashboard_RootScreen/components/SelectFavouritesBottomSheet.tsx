import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {
  BottomSheetContainer,
  useBottomSheet,
} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {Toggle} from '@atb/components/toggle';
import {ThemeText} from '@atb/components/text';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet, useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import SelectFavouriteDeparturesText from '@atb/translations/screens/subscreens/SelectFavouriteDeparturesTexts';
import {TransportationIconBox} from '@atb/components/icon-box';
import {StoredFavoriteDeparture, useFavorites} from '@atb/favorites';
import {SectionSeparator} from '@atb/components/sections';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import SvgArrowRight from '@atb/assets/svg/mono-icons/navigation/ArrowRight';
import {formatDestinationDisplay} from '@atb/travel-details-screens/utils';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';

type SelectableFavouriteDepartureData = {
  handleSwitchFlip: (favouriteId: string, active: boolean) => void;
  favorite: StoredFavoriteDeparture;
  testID?: string;
};

const SelectableFavouriteDeparture = ({
  handleSwitchFlip,
  favorite,
  testID,
}: SelectableFavouriteDepartureData) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const active = !!favorite.visibleOnDashboard;
  const departureQuay = favorite.quayPublicCode;
  const lineIdentifier = favorite.lineLineNumber ?? '';
  const lineTransportationMode = favorite.lineTransportationMode ?? Mode.Bus;

  const lineName =
    formatDestinationDisplay(t, favorite.destinationDisplay) ??
    t(SelectFavouriteDeparturesText.departures.allVariations);

  return (
    <View
      style={styles.selectableDeparture}
      accessible={true}
      accessibilityLabel={`${t(
        getTranslatedModeName(lineTransportationMode),
      )} ${lineIdentifier} ${lineName}, ${t(
        SelectFavouriteDeparturesText.accessibleText.from,
      )} ${favorite.quayName} ${departureQuay && departureQuay}`}
      accessibilityRole="switch"
      accessibilityActions={[{name: 'activate'}]}
      onAccessibilityAction={() => handleSwitchFlip(favorite.id, !active)}
      accessibilityHint={t(SelectFavouriteDeparturesText.switch.a11yhint)}
      accessibilityState={{checked: active}}
    >
      <TransportationIconBox
        style={styles.lineModeIcon}
        mode={lineTransportationMode}
        subMode={favorite.lineTransportationSubMode}
      />
      <View style={styles.selectableDepartureTextView}>
        <ThemeText typography="body__primary" style={styles.lineIdentifierText}>
          {lineIdentifier} {lineName}
        </ThemeText>

        <ThemeText typography="body__secondary" style={styles.secondaryText}>
          {t(SelectFavouriteDeparturesText.departures.from)} {favorite.quayName}
          {departureQuay && ' ' + departureQuay}
        </ThemeText>
      </View>

      <View>
        <Toggle
          importantForAccessibility="no"
          value={active}
          onValueChange={(value) => handleSwitchFlip(favorite.id, value)}
          testID={testID}
        />
      </View>
    </View>
  );
};

type SelectFavouritesBottomSheetProps = {
  onEditFavouriteDeparture: () => void;
};

export const SelectFavouritesBottomSheet = ({
  onEditFavouriteDeparture,
}: SelectFavouritesBottomSheetProps) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useTheme();
  const {favoriteDepartures, setFavoriteDepartures} = useFavorites();
  const favouriteItems = favoriteDepartures ?? [];
  const [updatedFavorites, setUpdatedFavorites] = useState(favoriteDepartures);
  const {close} = useBottomSheet();

  const handleSwitchFlip = (id: string, active: boolean) => {
    setUpdatedFavorites(
      updatedFavorites.map((f) =>
        f.id == id ? {...f, visibleOnDashboard: active} : f,
      ),
    );
  };

  const saveAndExit = () => {
    setFavoriteDepartures(updatedFavorites);
    close();
  };

  return (
    <BottomSheetContainer
      title={t(SelectFavouriteDeparturesText.header.text)}
      testID="selectFavoriteBottomSheet"
    >
      <ScrollView style={styles.flatListArea}>
        {favoriteDepartures.length > 0 && (
          <>
            <ThemeText
              style={styles.questionText}
              typography="heading__component"
            >
              {t(SelectFavouriteDeparturesText.title.text)}
            </ThemeText>

            <View>
              {updatedFavorites &&
                updatedFavorites.map((favorite, i) => (
                  <View key={favorite.id}>
                    <SectionSeparator />
                    <SelectableFavouriteDeparture
                      handleSwitchFlip={handleSwitchFlip}
                      favorite={favorite}
                      testID={'selectFavoriteToggle' + i}
                    />
                  </View>
                ))}
            </View>
          </>
        )}
        {!favouriteItems.length && (
          <MessageInfoBox
            type="info"
            message={t(SelectFavouriteDeparturesText.noFavourites.text)}
          />
        )}
      </ScrollView>

      <FullScreenFooter>
        <View style={styles.buttonContainer}>
          <Button
            interactiveColor={theme.color.interactive[0]}
            text={t(SelectFavouriteDeparturesText.confirm_button.text)}
            accessibilityHint={t(
              SelectFavouriteDeparturesText.confirm_button.a11yhint,
            )}
            onPress={saveAndExit}
            disabled={false}
            rightIcon={{svg: Confirm}}
            testID="confirmButton"
          />
          <Button
            text={t(SelectFavouriteDeparturesText.edit_button.text)}
            accessibilityHint={t(
              SelectFavouriteDeparturesText.edit_button.a11yhint,
            )}
            onPress={() => {
              close();
              onEditFavouriteDeparture();
            }}
            rightIcon={{svg: SvgArrowRight}}
            testID="editButton"
            mode="secondary"
          />
        </View>
      </FullScreenFooter>
    </BottomSheetContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      flex: 1,
    },
    buttonContainer: {
      gap: theme.spacing.small,
    },
    questionText: {
      padding: theme.spacing.medium,
    },
    flatListArea: {
      backgroundColor: theme.color.background.neutral[0].background,
      margin: theme.spacing.medium,
      marginBottom: theme.spacing.xLarge,
      borderRadius: theme.border.radius.regular,
    },
    selectableDeparture: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.medium,
    },
    selectableDepartureTextView: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      paddingVertical: theme.spacing.medium,
    },
    secondaryText: {
      color: theme.color.foreground.dynamic.secondary,
    },
    lineModeIcon: {
      marginRight: theme.spacing.small,
    },
    lineIdentifierText: {
      marginBottom: theme.spacing.small,
    },
  };
});
