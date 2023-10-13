import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button, ButtonGroup} from '@atb/components/button';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {Toggle} from '@atb/components/toggle';
import {ThemeText} from '@atb/components/text';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet} from '@atb/theme';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import SelectFavouriteDeparturesText from '@atb/translations/screens/subscreens/SelectFavouriteDeparturesTexts';
import {TransportationIconBox} from '@atb/components/icon-box';
import {StoredFavoriteDeparture, useFavorites} from '@atb/favorites';
import {LegMode} from '@entur/sdk';
import {SectionSeparator} from '@atb/components/sections';
import {MessageBox} from '@atb/components/message-box';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import SvgArrowRight from '@atb/assets/svg/mono-icons/navigation/ArrowRight';
import {getDestinationLineName} from '@atb/travel-details-screens/utils';

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
  const lineTransportationMode = favorite.lineTransportationMode ?? LegMode.BUS;

  const lineName =
    favorite.lineName ??
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
        <ThemeText type="body__primary" style={styles.lineIdentifierText}>
          {lineIdentifier} {lineName}
        </ThemeText>

        <ThemeText type="body__secondary" style={styles.secondaryText}>
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
  close: () => void;
  onEditFavouriteDeparture: () => void;
};

export const SelectFavouritesBottomSheet = ({
  close,
  onEditFavouriteDeparture,
}: SelectFavouritesBottomSheetProps) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {favoriteDepartures, setFavoriteDepartures} = useFavorites();
  const favouriteItems = favoriteDepartures ?? [];
  const [updatedFavorites, setUpdatedFavorites] = useState(favoriteDepartures);

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
    <BottomSheetContainer testID="selectFavoriteBottomSheet">
      <ScreenHeaderWithoutNavigation
        title={t(SelectFavouriteDeparturesText.header.text)}
        leftButton={{
          type: 'cancel',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.cancel.text),
        }}
        color="background_1"
        setFocusOnLoad={true}
      />

      <ScrollView style={styles.flatListArea}>
        {favoriteDepartures.length > 0 && (
          <>
            <ThemeText style={styles.questionText} type="heading__component">
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
          <MessageBox
            type="info"
            message={t(SelectFavouriteDeparturesText.noFavourites.text)}
          />
        )}
      </ScrollView>

      <FullScreenFooter>
        <ButtonGroup>
          <Button
            interactiveColor="interactive_0"
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
            interactiveColor="interactive_2"
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
        </ButtonGroup>
      </FullScreenFooter>
    </BottomSheetContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      flex: 1,
    },
    questionText: {
      padding: theme.spacings.medium,
    },
    flatListArea: {
      backgroundColor: theme.static.background.background_0.background,
      margin: theme.spacings.medium,
      marginBottom: theme.spacings.xLarge,
      borderRadius: theme.border.radius.regular,
    },
    selectableDeparture: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacings.medium,
    },
    selectableDepartureTextView: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      paddingVertical: theme.spacings.medium,
    },
    secondaryText: {
      color: theme.text.colors.secondary,
    },
    lineModeIcon: {
      marginRight: theme.spacings.small,
    },
    lineIdentifierText: {
      marginBottom: theme.spacings.small,
    },
  };
});
