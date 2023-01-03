import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button, ButtonGroup} from '@atb/components/button';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {FixedSwitch} from '@atb/components/switch';
import {ThemeText} from '@atb/components/text';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet} from '@atb/theme';
import {
  ScreenHeaderTexts,
  TranslatedString,
  useTranslation,
} from '@atb/translations';
import SelectFavouriteDeparturesText from '@atb/translations/screens/subscreens/SelectFavouriteDeparturesTexts';
import {TransportationIcon, AnyMode} from '@atb/components/transportation-icon';
import {useFavorites} from '@atb/favorites';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';
import {LegMode} from '@entur/sdk';
import {SectionSeparator} from '@atb/components/sections';
import {MessageBox} from '@atb/components/message-box';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import SvgArrowRight from '@atb/assets/svg/mono-icons/navigation/ArrowRight';

type SelectableFavouriteDepartureData = {
  handleSwitchFlip: (favouriteId: string, active: boolean) => void;
  favouriteId: string;
  active: boolean;
  lineTransportationMode: AnyMode;
  lineTransportationSubmode?: TransportSubmode;
  lineIdentifier: string;
  lineName: string | TranslatedString;
  departureStation: string;
  departureQuay?: string;
};

const SelectableFavouriteDeparture = ({
  handleSwitchFlip,
  favouriteId,
  active,
  lineTransportationMode,
  lineTransportationSubmode,
  lineIdentifier,
  lineName,
  departureStation,
  departureQuay,
}: SelectableFavouriteDepartureData) => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <View
      style={styles.selectableDeparture}
      accessible={true}
      accessibilityLabel={`${t(
        getTranslatedModeName(lineTransportationMode),
      )} ${lineIdentifier} ${lineName}, ${t(
        SelectFavouriteDeparturesText.accessibleText.from,
      )} ${departureStation} ${departureQuay && departureQuay}`}
      accessibilityRole="switch"
      accessibilityActions={[{name: 'activate'}]}
      onAccessibilityAction={() => handleSwitchFlip(favouriteId, !active)}
      accessibilityHint={t(SelectFavouriteDeparturesText.switch.a11yhint)}
      accessibilityState={{checked: active}}
    >
      <View style={styles.lineModeIcon}>
        <TransportationIcon
          mode={lineTransportationMode}
          subMode={lineTransportationSubmode}
        />
      </View>
      <View style={styles.selectableDepartureTextView}>
        <ThemeText type="body__primary" style={styles.lineIdentiferText}>
          {lineIdentifier} {lineName}
        </ThemeText>

        <ThemeText type="body__secondary" style={styles.secondaryText}>
          {t(SelectFavouriteDeparturesText.departures.from)} {departureStation}
          {departureQuay && ' ' + departureQuay}
        </ThemeText>
      </View>

      <View>
        <FixedSwitch
          importantForAccessibility="no"
          value={active}
          onValueChange={(value) => handleSwitchFlip(favouriteId, value)}
        />
      </View>
    </View>
  );
};

type SelectFavouritesBottomSheetProps = {
  close: () => void;
  onEditFavouriteDeparture: () => void;
};

const SelectFavouritesBottomSheet = ({
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
    <BottomSheetContainer>
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
                updatedFavorites.map((favorite, index) => {
                  return (
                    <View key={favorite.id}>
                      <SelectableFavouriteDeparture
                        handleSwitchFlip={handleSwitchFlip}
                        favouriteId={favorite.id}
                        active={!!favorite.visibleOnDashboard}
                        departureStation={favorite.quayName}
                        departureQuay={favorite.quayPublicCode}
                        lineIdentifier={favorite.lineLineNumber ?? ''}
                        lineName={
                          favorite.lineName ??
                          t(
                            SelectFavouriteDeparturesText.departures
                              .allVariations,
                          )
                        }
                        lineTransportationMode={
                          favorite.lineTransportationMode ?? LegMode.BUS
                        }
                        lineTransportationSubmode={
                          favorite.lineTransportationSubMode
                        }
                      />
                      {favouriteItems.length - 1 !== index && (
                        <SectionSeparator />
                      )}
                    </View>
                  );
                })}
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

export default SelectFavouritesBottomSheet;

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
    lineIdentiferText: {
      marginBottom: theme.spacings.small,
    },
  };
});
