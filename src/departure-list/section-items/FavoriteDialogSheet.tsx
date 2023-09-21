import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {
  DeparturesTexts,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button, ButtonGroup} from '@atb/components/button';
import SvgFavoriteSemi from '@atb/assets/svg/mono-icons/places/FavoriteSemi';
import SvgFavoriteFill from '@atb/assets/svg/mono-icons/places/FavoriteFill';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import React, {forwardRef} from 'react';
import {StyleSheet} from '@atb/theme/StyleSheet';

type Props = {
  lineNumber: string;
  lineName: string;
  addFavorite: (forSpecificLineName: boolean) => void;
  close: () => void;
};

export const FavoriteDialogSheet = forwardRef<View, Props>(
  ({lineNumber, lineName, addFavorite, close}, focusRef) => {
    const {t} = useTranslation();
    const styles = useStyles();
    return (
      <BottomSheetContainer testID="chooseFavoriteBottomSheet">
        <ScreenHeaderWithoutNavigation
          title={t(DeparturesTexts.favoriteDialogSheet.title)}
          color="background_1"
          leftButton={{
            type: 'cancel',
            onPress: close,
            text: t(ScreenHeaderTexts.headerButton.cancel.text),
          }}
        />
        <View style={styles.text} ref={focusRef} accessible={true}>
          <ThemeText>
            {t(
              DeparturesTexts.favoriteDialogSheet.description(
                lineNumber,
                lineName,
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
