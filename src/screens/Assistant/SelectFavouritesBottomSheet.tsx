import React from 'react';
import {Platform, ScrollView, View} from 'react-native';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import Button from '@atb/components/button';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import FixedSwitch from '@atb/components/switch';
import ThemeText from '@atb/components/text';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet} from '@atb/theme';
import {
  ScreenHeaderTexts,
  TranslatedString,
  useTranslation,
} from '@atb/translations';
import SelectFavouriteDeparturesText from '@atb/translations/screens/subscreens/SelectFavouriteDeparturesTexts';
import TransportationIcon from '@atb/components/transportation-icon';
import {useFavorites} from '@atb/favorites';
import useFontScale from '@atb/utils/use-font-scale';
import {AnyMode} from '@atb/components/transportation-icon';
import {LegMode, TransportSubmode} from '@entur/sdk';
import SectionSeparator from '@atb/components/sections/section-separator';
import MessageBox from '@atb/components/message-box';

type SelectableFavouriteDepartureData = {
  handleSwitchFlip: (favouriteId: any) => void;
  favouriteId: string;
  active: boolean;
  lineTransportationMode: AnyMode;
  lineTransportationSubmode?: TransportSubmode;
  lineIdentifier: string;
  lineName: string | TranslatedString;
  departureStation: string;
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
}: SelectableFavouriteDepartureData) => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <View style={styles.selectableDeparture}>
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
        </ThemeText>
      </View>

      <View>
        <FixedSwitch
          accessibilityHint={t(SelectFavouriteDeparturesText.switch.a11yhint)}
          value={active}
          onChange={() => handleSwitchFlip(favouriteId)}
          style={[
            styles.toggle,
            Platform.OS === 'android' ? styles.androidToggle : styles.iosToggle,
          ]}
        />
      </View>
    </View>
  );
};

type SelectFavouritesBottomSheetProps = {
  close: () => void;
};

const SelectFavouritesBottomSheet = ({
  close,
}: SelectFavouritesBottomSheetProps) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {
    favoriteDepartures,
    frontPageFavouriteDepartures,
    addFrontPageFavouriteDeparture,
    removeFrontPageFavouriteDeparture,
  } = useFavorites();
  const favouriteItems = favoriteDepartures ?? [];
  const frontpageFavouriteItems = frontPageFavouriteDepartures ?? [];

  const handleSwitchFlip = (favouriteId: string) => {
    const favouriteInFrontpageFavourites = frontpageFavouriteItems.find(
      (item) => item.id === favouriteId,
    );

    if (favouriteInFrontpageFavourites) {
      removeFrontPageFavouriteDeparture(favouriteInFrontpageFavourites);
    } else {
      const favourite = favoriteDepartures.find(
        (departure) => departure.id === favouriteId,
      );
      if (favourite) addFrontPageFavouriteDeparture(favourite);
    }
  };

  return (
    <BottomSheetContainer>
      <ScreenHeaderWithoutNavigation
        title={t(SelectFavouriteDeparturesText.header.text)}
        leftButton={{
          type: 'cancel',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        color="background_1"
      />

      <ScrollView style={styles.flatListArea}>
        {favoriteDepartures.length > 0 && (
          <>
            <ThemeText style={styles.questionText} type="heading__component">
              {t(SelectFavouriteDeparturesText.title.text)}
            </ThemeText>

            <View>
              {favouriteItems &&
                favouriteItems.map((departureDetails, index) => {
                  return (
                    <View key={departureDetails.id}>
                      <SelectableFavouriteDeparture
                        handleSwitchFlip={handleSwitchFlip}
                        favouriteId={departureDetails.id}
                        active={
                          !!frontPageFavouriteDepartures.find(
                            (departure) => departure.id === departureDetails.id,
                          )
                        }
                        departureStation={departureDetails.quayName}
                        lineIdentifier={departureDetails.lineLineNumber ?? ''}
                        lineName={
                          departureDetails.lineName ??
                          t(
                            SelectFavouriteDeparturesText.departures
                              .allVariations,
                          )
                        }
                        lineTransportationMode={
                          departureDetails.lineTransportationMode ?? LegMode.BUS
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
            message={t(SelectFavouriteDeparturesText.noFavourites.text)}
          />
        )}
      </ScrollView>

      <FullScreenFooter>
        <Button
          interactiveColor="interactive_0"
          text={t(SelectFavouriteDeparturesText.confirm_button.text)}
          accessibilityHint={t(
            SelectFavouriteDeparturesText.confirm_button.a11yhint,
          )}
          onPress={close}
          disabled={false}
          icon={Confirm}
          iconPosition="right"
          testID="confirmButton"
        />
      </FullScreenFooter>
    </BottomSheetContainer>
  );
};

export default SelectFavouritesBottomSheet;

const useStyles = StyleSheet.createThemeHook((theme) => {
  const scale = useFontScale();
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
    toggle: {
      alignSelf: 'center',
    },
    androidToggle: {
      transform: [{scale: scale}, {translateY: -6}],
    },
    iosToggle: {
      marginLeft: theme.spacings.xSmall,
      transform: [{scale: 0.7 * scale}],
    },
  };
});
