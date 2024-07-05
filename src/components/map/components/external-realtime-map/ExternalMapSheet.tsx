import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {MapTexts, useTranslation} from '@atb/translations';
import {Linking, View} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeText} from '@atb/components/text';

type ExternalRealtimeMapLinkSheetProps = {
  onClose: () => void;
  url: string;
};
export const ExternalMapSheet = ({
  onClose,
  url,
}: ExternalRealtimeMapLinkSheetProps) => {
  const {t} = useTranslation();
  const style = useStyle();

  return (
    <BottomSheetContainer
      title={t(MapTexts.externalRealtimeMap.bottomSheet.heading)}
      onClose={onClose}
    >
      <View style={style.container}>
        <ThemeText>
          {t(MapTexts.externalRealtimeMap.bottomSheet.description)}
        </ThemeText>
      </View>
      <FullScreenFooter>
        <Button
          text={t(MapTexts.externalRealtimeMap.bottomSheet.button)}
          onPress={() => {
            Linking.openURL(url);
            onClose();
          }}
          rightIcon={{svg: ExternalLink}}
        />
      </FullScreenFooter>
    </BottomSheetContainer>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      marginHorizontal: theme.spacings.medium,
      marginBottom: theme.spacings.medium,
    },
  };
});
