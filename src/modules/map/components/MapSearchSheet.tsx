import React from 'react';
import {
  BottomSheetHeaderType,
  MapBottomSheet,
} from '@atb/components/bottom-sheet';
import {ButtonSectionItem, Section} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Search} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations';

type MapSearchSheetProps = {
  onSearchPress: () => void;
  locationArrowOnPress: () => void;
  navigateToScanQrCode: () => void;
};

export const MapSearchSheet = ({
  onSearchPress,
  locationArrowOnPress,
  navigateToScanQrCode,
}: MapSearchSheetProps) => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <MapBottomSheet
      allowBackgroundTouch={true}
      closeOnBackdropPress={false}
      enablePanDownToClose={false}
      bottomSheetHeaderType={BottomSheetHeaderType.None}
      locationArrowOnPress={locationArrowOnPress}
      navigateToScanQrCode={navigateToScanQrCode}
    >
      <Section style={styles.container}>
        <ButtonSectionItem
          label={t(MapTexts.search.label)}
          placeholder={t(MapTexts.search.placeholder)}
          onPress={onSearchPress}
          icon={<ThemeIcon svg={Search} />}
          testID="mapSearchButton"
        />
      </Section>
    </MapBottomSheet>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
}));
