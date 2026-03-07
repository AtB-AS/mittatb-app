import {DeparturesTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import SvgFavoriteSemi from '@atb/assets/svg/mono-icons/places/FavoriteSemi';
import SvgFavoriteFill from '@atb/assets/svg/mono-icons/places/FavoriteFill';
import React from 'react';
import {StyleSheet} from '@atb/theme/StyleSheet';
import {DestinationDisplay} from '@atb/api/types/generated/journey_planner_v3_types';
import {formatDestinationDisplay} from '@atb/screen-components/travel-details-screens';
import {useThemeContext} from '@atb/theme';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';

type Props = {
  lineNumber: string;
  destinationDisplay: DestinationDisplay;
  addFavorite: (forSpecificLineName: boolean) => void;
  quayName: string;
  onCloseFocusRef: React.RefObject<View | null>;
  bottomSheetModalRef: React.RefObject<GorhomBottomSheetModal | null>;
  onCloseCallback?: () => void;
};

export const FavoriteDialogSheet = ({
  lineNumber,
  destinationDisplay,
  addFavorite,
  quayName,
  onCloseFocusRef,
  bottomSheetModalRef,
  onCloseCallback,
}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[0];
  const styles = useStyles();
  const lineName = formatDestinationDisplay(t, destinationDisplay) || '';

  const Footer = () => (
    <FullScreenFooter>
      <View style={styles.buttonContainer}>
        <Button
          expanded={true}
          interactiveColor={interactiveColor}
          onPress={() => {
            bottomSheetModalRef.current?.dismiss();
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
            bottomSheetModalRef.current?.dismiss();
            addFavorite(false);
          }}
          text={t(DeparturesTexts.favoriteDialogSheet.buttons.all(lineNumber))}
          rightIcon={{svg: SvgFavoriteFill}}
          testID="allVariationsOfDeparture"
        />
      </View>
    </FullScreenFooter>
  );

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(DeparturesTexts.favoriteDialogSheet.title)}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      closeCallback={() => {
        giveFocus(onCloseFocusRef);
        onCloseCallback?.();
      }}
      Footer={Footer}
      testID="chooseFavorite"
    >
      <View style={styles.text} accessible={true}>
        <ThemeText>
          {t(
            DeparturesTexts.favoriteDialogSheet.description(
              lineNumber,
              quayName,
            ),
          )}
        </ThemeText>
      </View>
    </BottomSheetModal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  text: {
    marginHorizontal: theme.spacing.medium,
  },
  buttonContainer: {
    gap: theme.spacing.small,
  },
}));
