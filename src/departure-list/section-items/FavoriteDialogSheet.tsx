import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {
  NearbyTexts,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import Button, {ButtonGroup} from '@atb/components/button';
import SvgFavoriteSemi from '@atb/assets/svg/mono-icons/places/FavoriteSemi';
import SvgFavoriteFill from '@atb/assets/svg/mono-icons/places/FavoriteFill';
import {
  BottomSheetContainer,
  BottomSheetSize,
} from '@atb/components/bottom-sheet';
import React, {forwardRef} from 'react';
import StyleSheet from '@atb/theme/StyleSheet';

type Props = {
  lineNumber: string;
  lineName: string;
  addFavorite: (forSpecificLineName: boolean) => void;
  close: () => void;
};

const FavoriteDialogSheet = forwardRef<View, Props>(
  ({lineNumber, lineName, addFavorite, close}, focusRef) => {
    const {t} = useTranslation();
    const styles = useStyles();
    return (
      <BottomSheetContainer sheetSize={BottomSheetSize.auto}>
        <ScreenHeaderWithoutNavigation
          title={t(NearbyTexts.favoriteDialogSheet.title)}
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
              NearbyTexts.favoriteDialogSheet.description(lineNumber, lineName),
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
                NearbyTexts.favoriteDialogSheet.buttons.specific(
                  lineNumber,
                  lineName,
                ),
              )}
              icon={SvgFavoriteSemi}
              iconPosition={'right'}
            />
            <Button
              interactiveColor="interactive_0"
              onPress={() => {
                close();
                addFavorite(false);
              }}
              text={t(NearbyTexts.favoriteDialogSheet.buttons.all(lineNumber))}
              icon={SvgFavoriteFill}
              iconPosition={'right'}
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

export default FavoriteDialogSheet;
