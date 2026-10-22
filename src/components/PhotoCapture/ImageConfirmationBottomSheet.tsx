import {Button} from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {Image, View} from 'react-native';
import {Coordinates} from '@atb/utils/coordinates';
import {UserCoordinatesMap} from '../../stacks-hierarchy/Root_ShmoHelp/components/UserCoordinatesMap';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
  BottomSheetModalMethods,
} from '../bottom-sheet';
import {giveFocus} from '@atb/utils/use-focus-on-load';

type Props = {
  file: string;
  coordinates: Coordinates | undefined;
  onConfirm: () => void;
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods | null>;
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
  const styles = useStyles();

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(ParkingViolationTexts.imageConfirmation.title)}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
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
          surfaceColor="accent"
          expanded={true}
          style={styles.button}
          onPress={onConfirm}
          text={t(ParkingViolationTexts.imageConfirmation.confirmButton)}
        />
        <Button
          surfaceColor="accent"
          expanded={true}
          style={styles.button}
          mode="secondary"
          onPress={() => bottomSheetModalRef.current?.dismiss()}
          text={t(ParkingViolationTexts.imageConfirmation.retryButton)}
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
