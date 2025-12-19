import {MapTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {Button} from '@atb/components/button';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeText} from '@atb/components/text';
import {ScrollView} from 'react-native-gesture-handler';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {
  BottomSheetHeaderType,
  MapBottomSheet,
} from '@atb/components/bottom-sheet-v2';
import {Linking} from 'react-native';

type ExternalRealtimeMapLinkSheetProps = {
  onClose: () => void;
  url: string;
  locationArrowOnPress: () => void;
  navigateToScanQrCode: () => void;
};
export const ExternalRealtimeMapSheet = ({
  onClose,
  url,
  locationArrowOnPress,
  navigateToScanQrCode,
}: ExternalRealtimeMapLinkSheetProps) => {
  const {t} = useTranslation();
  const style = useStyle();

  return (
    <MapBottomSheet
      closeCallback={onClose}
      allowBackgroundTouch={false}
      heading={t(MapTexts.externalRealtimeMap.bottomSheet.heading)}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      locationArrowOnPress={locationArrowOnPress}
      navigateToScanQrCode={navigateToScanQrCode}
    >
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        <Section>
          <GenericSectionItem type="spacious">
            <ThemeText>
              {t(MapTexts.externalRealtimeMap.bottomSheet.description)}
            </ThemeText>
          </GenericSectionItem>
        </Section>
        <Button
          expanded={true}
          text={t(MapTexts.externalRealtimeMap.bottomSheet.button)}
          onPress={() => {
            Linking.openURL(url);
            onClose();
          }}
          rightIcon={{svg: ExternalLink}}
        />
      </ScrollView>
    </MapBottomSheet>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      backgroundColor: theme.color.background.neutral[1].background,
      marginHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
    },
    contentContainer: {
      rowGap: theme.spacing.medium,
    },
  };
});
