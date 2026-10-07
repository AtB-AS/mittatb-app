import React from 'react';
import {View} from 'react-native';
import {
  BottomSheetHeaderType,
  MapBottomSheet,
} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {Location} from '@atb/modules/favorites';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import DeparturesDialogSheetTexts from '@atb/translations/components/DeparturesDialogSheet';
import {NavigateToTripSearchCallback} from '../types';

type SelectedLocationSheetProps = {
  location: Location;
  onClose: () => void;
  navigateToTripSearch: NavigateToTripSearchCallback;
  locationArrowOnPress: () => void;
  navigateToScanQrCode: () => void;
};

export const SelectedLocationSheet = ({
  location,
  onClose,
  navigateToTripSearch,
  locationArrowOnPress,
  navigateToScanQrCode,
}: SelectedLocationSheetProps) => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <MapBottomSheet
      closeCallback={onClose}
      allowBackgroundTouch={true}
      heading={location.name}
      subText={getSubText(location)}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      locationArrowOnPress={locationArrowOnPress}
      navigateToScanQrCode={navigateToScanQrCode}
    >
      <View style={styles.buttonsContainer}>
        <View style={styles.travelButton}>
          <Button
            expanded={true}
            text={t(DeparturesDialogSheetTexts.travelFrom.title)}
            onPress={() => navigateToTripSearch(location, 'fromLocation')}
            mode="primary"
          />
        </View>
        <View style={styles.travelButton}>
          <Button
            expanded={true}
            text={t(DeparturesDialogSheetTexts.travelTo.title)}
            onPress={() => navigateToTripSearch(location, 'toLocation')}
            mode="primary"
          />
        </View>
      </View>
    </MapBottomSheet>
  );
};

function getSubText(location: Location): string | undefined {
  if (location.resultType === 'geolocation') return undefined;
  return [location.postalcode, location.locality].filter(Boolean).join(', ');
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  buttonsContainer: {
    paddingHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    flexDirection: 'row',
    gap: theme.spacing.small,
  },
  travelButton: {
    flexGrow: 1,
  },
}));
