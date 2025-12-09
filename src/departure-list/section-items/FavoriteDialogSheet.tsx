import {DeparturesTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import SvgFavoriteSemi from '@atb/assets/svg/mono-icons/places/FavoriteSemi';
import SvgFavoriteFill from '@atb/assets/svg/mono-icons/places/FavoriteFill';
import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import React, {forwardRef} from 'react';
import {StyleSheet} from '@atb/theme/StyleSheet';
import {DestinationDisplay} from '@atb/api/types/generated/journey_planner_v3_types';
import {formatDestinationDisplay} from '@atb/screen-components/travel-details-screens';
import {useThemeContext} from '@atb/theme';
import SvgTime from '@atb/assets/svg/mono-icons/time/Time';

type Props = {
  lineNumber: string;
  destinationDisplay: DestinationDisplay;
  addFavorite: (forSpecificLineName: boolean) => void;
  addSpecificDepartureJourneyFavorite: () => void;
  quayName: string;
};

export const FavoriteDialogSheet = forwardRef<View, Props>(
  (
    {
      lineNumber,
      destinationDisplay,
      addFavorite,
      addSpecificDepartureJourneyFavorite,
      quayName,
    },
    focusRef,
  ) => {
    const {t} = useTranslation();
    const {theme} = useThemeContext();
    const interactiveColor = theme.color.interactive[0];
    const styles = useStyles();
    const lineName = formatDestinationDisplay(t, destinationDisplay) || '';
    const {close} = useBottomSheetContext();
    return (
      <BottomSheetContainer
        title={t(DeparturesTexts.favoriteDialogSheet.title)}
        testID="chooseFavoriteBottomSheet"
        focusTitleOnLoad={false}
      >
        <View style={styles.text} ref={focusRef} accessible={true}>
          <ThemeText>
            {t(
              DeparturesTexts.favoriteDialogSheet.description(
                lineNumber,
                quayName,
              ),
            )}
          </ThemeText>
        </View>
        <FullScreenFooter>
          <View style={styles.buttonContainer}>
            {addSpecificDepartureJourneyFavorite && (
              <Button
                expanded={true}
                interactiveColor={interactiveColor}
                onPress={() => {
                  close();
                  addSpecificDepartureJourneyFavorite();
                }}
                text={t(
                  DeparturesTexts.favoriteDialogSheet.buttons
                    .specificServiceJourney,
                )}
                rightIcon={{svg: SvgTime}}
                testID="onlySelectedServiceJourney"
              />
            )}
            <Button
              expanded={true}
              interactiveColor={interactiveColor}
              onPress={() => {
                close();
                addFavorite(true);
              }}
              text={t(
                DeparturesTexts.favoriteDialogSheet.buttons.specific(
                  lineNumber,
                  lineName,
                ),
              )}
              rightIcon={{svg: SvgFavoriteSemi}}
              testID="onlySelectedDeparture"
            />
            <Button
              expanded={true}
              interactiveColor={interactiveColor}
              onPress={() => {
                close();
                addFavorite(false);
              }}
              text={t(
                DeparturesTexts.favoriteDialogSheet.buttons.all(lineNumber),
              )}
              rightIcon={{svg: SvgFavoriteFill}}
              testID="allVariationsOfDeparture"
            />
          </View>
        </FullScreenFooter>
      </BottomSheetContainer>
    );
  },
);

const useStyles = StyleSheet.createThemeHook((theme) => ({
  text: {
    margin: theme.spacing.medium,
  },
  buttonContainer: {
    gap: theme.spacing.small,
  },
}));
