import React from 'react';
import {Platform, View} from 'react-native';

import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import Button from '@atb/components/button';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import FixedSwitch from '@atb/components/switch';
import ThemeText from '@atb/components/text';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet} from '@atb/theme';
import {TranslatedString, useTranslation} from '@atb/translations';
import SelectFavouriteDeparturesText from '@atb/translations/screens/subscreens/SelectFavouriteDeparturesTexts';
import ThemeIcon from '@atb/components/theme-icon';
import {useFavorites} from '@atb/favorites';
import useFontScale from '@atb/utils/use-font-scale';

type SelectableFavouriteDepartureData = {
  lineIdentifier: string;
  lineName: string | TranslatedString;
  departureStation: string;
};

const SelectableFavouriteDeparture = ({
  lineIdentifier,
  lineName,
  departureStation,
}: SelectableFavouriteDepartureData) => {
  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={{flexDirection: 'row'}}>
      <View style={styles.selectableDepartureTextView}>
        <ThemeText type="body__primary" style={styles.lineIdentiferText}>
          {lineIdentifier} {lineName}
        </ThemeText>

        <ThemeText type="body__secondary">
          {t(SelectFavouriteDeparturesText.departures.from)} {departureStation}
        </ThemeText>
      </View>

      <View>
        <FixedSwitch
          accessibilityHint={t(SelectFavouriteDeparturesText.switch.a11yhint)}
          value={false}
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
  const {favoriteDepartures} = useFavorites();
  const items = favoriteDepartures ?? [];

  console.log('favorites', favoriteDepartures);

  return (
    <BottomSheetContainer fullHeight={true}>
      <View style={styles.container}>
        <ScreenHeaderWithoutNavigation
          title={t(SelectFavouriteDeparturesText.header.text)}
          leftButton={{
            type: 'cancel',
            onPress: close,
            text: 'Close',
          }}
        />

        <View style={{flexShrink: 100, flexGrow: 100}}>
          <View style={styles.whiteArea}>
            <View>
              <ThemeText style={styles.questionText} type="heading__component">
                {t(SelectFavouriteDeparturesText.title.text)}
              </ThemeText>
              {items.map((departure) => (
                <SelectableFavouriteDeparture
                  departureStation={departure.quayName}
                  lineIdentifier={departure.lineLineNumber ?? ''}
                  lineName={
                    departure.lineName ??
                    t(SelectFavouriteDeparturesText.departures.allVariations)
                  }
                  key={departure.id}
                />
              ))}
            </View>
          </View>
        </View>
        <FullScreenFooter>
          <Button
            interactiveColor="interactive_0"
            text={t(SelectFavouriteDeparturesText.confirm_button.text)}
            accessibilityHint={t(
              SelectFavouriteDeparturesText.confirm_button.a11yhint,
            )}
            onPress={() => {
              close();
            }}
            disabled={false}
            icon={Confirm}
            iconPosition="right"
            testID="confirmButton"
          />
        </FullScreenFooter>
      </View>
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
      paddingVertical: theme.spacings.medium,
    },
    whiteArea: {
      backgroundColor: 'white',
      margin: theme.spacings.medium,
      paddingHorizontal: theme.spacings.medium,
      borderRadius: theme.border.radius.regular,
    },
    selectableDeparture: {},
    selectableDepartureTextView: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      paddingVertical: theme.spacings.medium,
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
      transform: [{scale: 0.7 * scale}, {translateY: 10}],
    },
  };
});
