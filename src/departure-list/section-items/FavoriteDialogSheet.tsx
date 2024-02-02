import {DeparturesTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button, ButtonGroup} from '@atb/components/button';
import SvgFavoriteSemi from '@atb/assets/svg/mono-icons/places/FavoriteSemi';
import SvgFavoriteFill from '@atb/assets/svg/mono-icons/places/FavoriteFill';
import {
  BottomSheetContainer,
  useBottomSheet,
} from '@atb/components/bottom-sheet';
import React, {forwardRef} from 'react';
import {StyleSheet} from '@atb/theme/StyleSheet';
import {DestinationDisplay} from '@atb/api/types/generated/journey_planner_v3_types';
import {formatDestinationDisplay} from '@atb/travel-details-screens/utils';

type Props = {
  lineNumber: string;
  destinationDisplay: DestinationDisplay;
  addFavorite: (forSpecificLineName: boolean) => void;
  quayName: string;
};

export const FavoriteDialogSheet = forwardRef<View, Props>(
  ({lineNumber, destinationDisplay, addFavorite, quayName}, focusRef) => {
    const {t} = useTranslation();
    const styles = useStyles();
    const lineName = formatDestinationDisplay(t, destinationDisplay) || '';
    const {close} = useBottomSheet();
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
          <ButtonGroup>
            <Button
              interactiveColor="interactive_0"
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
              interactiveColor="interactive_0"
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
          </ButtonGroup>
        </FullScreenFooter>
      </BottomSheetContainer>
    );
  },
);

const useStyles = StyleSheet.createThemeHook((theme) => ({
  text: {
    margin: theme.spacings.medium,
  },
}));
