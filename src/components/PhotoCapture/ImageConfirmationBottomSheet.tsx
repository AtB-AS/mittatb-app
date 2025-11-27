import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';
import {Image, View} from 'react-native';
import {Coordinates} from '@atb/utils/coordinates';
import {UserCoordinatesMap} from '../../stacks-hierarchy/Root_ScooterHelp/components/UserCoordinatesMap';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {BottomSheetModal} from '../bottom-sheet-v2';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {giveFocus} from '@atb/utils/use-focus-on-load';

type Props = {
  file: string;
  coordinates: Coordinates | undefined;
  onConfirm: () => void;
  bottomSheetModalRef: React.RefObject<GorhomBottomSheetModal | null>;
  onCloseFocusRef: React.RefObject<View | null>;
};

export const ImageConfirmationBottomSheet = ({
  file,
  coordinates,
  onConfirm,
  bottomSheetModalRef,
  onCloseFocusRef,
}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(ParkingViolationTexts.imageConfirmation.title)}
      rightIconText={t(dictionary.appNavigation.close.text)}
      rightIcon={Close}
      closeCallback={() => {
        giveFocus(onCloseFocusRef);
      }}
    >
      <View style={styles.container}>
        <View style={styles.imageAndPosition}>
          <View style={styles.fullHeight}>
            <Image
              source={{uri: file}}
              style={{
                resizeMode: 'cover',
                aspectRatio: 3 / 4,
              }}
            />
          </View>
          <View style={styles.fullHeight}>
            <UserCoordinatesMap
              style={styles.fullHeight}
              userCoordinates={coordinates}
            />
          </View>
        </View>
        <Button
          expanded={true}
          style={styles.button}
          onPress={onConfirm}
          text={t(ParkingViolationTexts.imageConfirmation.confirmButton)}
        />
        <Button
          expanded={true}
          style={styles.button}
          mode="secondary"
          onPress={() => bottomSheetModalRef.current?.dismiss()}
          text={t(ParkingViolationTexts.imageConfirmation.retryButton)}
          backgroundColor={theme.color.background.neutral[1]}
        />
      </View>
    </BottomSheetModal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      marginHorizontal: theme.spacing.medium,
    },
    imageAndPosition: {
      flexDirection: 'row',
      columnGap: theme.spacing.medium,
    },
    fullHeight: {
      flex: 1,
    },
    button: {
      marginTop: theme.spacing.medium,
    },
  };
});
