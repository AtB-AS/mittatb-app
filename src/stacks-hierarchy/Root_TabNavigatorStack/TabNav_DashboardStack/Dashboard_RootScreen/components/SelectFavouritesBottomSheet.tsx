import React from 'react';
import {View} from 'react-native';
import {Button} from '@atb/components/button';
import {Toggle} from '@atb/components/toggle';
import {ThemeText} from '@atb/components/text';

import {Close} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet, type Theme, useThemeContext} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';
import SelectFavouriteDeparturesText from '@atb/translations/screens/subscreens/SelectFavouriteDeparturesTexts';
import {TransportationIconBox} from '@atb/components/icon-box';
import {
  StoredFavoriteDeparture,
  useFavoritesContext,
} from '@atb/modules/favorites';
import {SectionSeparator} from '@atb/components/sections';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import SvgArrowRight from '@atb/assets/svg/mono-icons/navigation/ArrowRight';
import {formatDestinationDisplay} from '@atb/screen-components/travel-details-screens';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import {BottomSheetModal} from '@atb/components/bottom-sheet-v2';
import {FullScreenFooter} from '@atb/components/screen-footer';

type SelectableFavouriteDepartureData = {
  handleSwitchFlip: (favouriteId: string, active: boolean) => void;
  favorite: StoredFavoriteDeparture;
  testID?: string;
};

const getThemeColor = (theme: Theme) => theme.color.background.neutral[0];

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
  BottomSheetModalRef: React.RefObject<GorhomBottomSheetModal | null>;
};

export const SelectFavouritesBottomSheet = ({
  onEditFavouriteDeparture,
  BottomSheetModalRef,
}: SelectFavouritesBottomSheetProps) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const {favoriteDepartures, setFavoriteDepartures} = useFavoritesContext();
  const favouriteItems = favoriteDepartures ?? [];

  const handleSwitchFlip = (id: string, active: boolean) => {
    setFavoriteDepartures(
      favoriteDepartures.map((f) =>
        f.id == id ? {...f, visibleOnDashboard: active} : f,
      ),
    );
  };

  const footer = (
    <FullScreenFooter>
      <View style={styles.buttonContainer}>
        <Button
          expanded={true}
          text={t(SelectFavouriteDeparturesText.edit_button.text)}
          accessibilityHint={t(
            SelectFavouriteDeparturesText.edit_button.a11yhint,
          )}
          onPress={() => {
            onEditFavouriteDeparture();
            BottomSheetModalRef.current?.dismiss();
          }}
          rightIcon={{svg: SvgArrowRight}}
          testID="editButton"
          mode="secondary"
          backgroundColor={themeColor}
        />
      </View>
    </FullScreenFooter>
  );

  return (
    <BottomSheetModal
      BottomSheetModalRef={BottomSheetModalRef}
      heading={t(SelectFavouriteDeparturesText.header.text)}
      rightIconText={t(dictionary.appNavigation.close.text)}
      rightIcon={Close}
      footer={footer}
    >
      <View style={styles.flatListArea}>
        {favoriteDepartures.length > 0 && (
          <>
            <ThemeText
              style={styles.questionText}
              typography="heading__component"
            >
              {t(SelectFavouriteDeparturesText.title.text)}
            </ThemeText>

            <View>
              {favoriteDepartures &&
                favoriteDepartures.map((favorite, i) => (
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
      </View>
    </BottomSheetModal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    buttonContainer: {
      gap: theme.spacing.small,
    },
    questionText: {
      padding: theme.spacing.medium,
    },
    flatListArea: {
      backgroundColor: getThemeColor(theme).background,
      marginHorizontal: theme.spacing.medium,
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
