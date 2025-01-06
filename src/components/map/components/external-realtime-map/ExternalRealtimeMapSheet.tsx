import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {MapTexts, useTranslation} from '@atb/translations';
import {Linking} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {Button} from '@atb/components/button';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeText} from '@atb/components/text';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GenericSectionItem, Section} from '@atb/components/sections';

type ExternalRealtimeMapLinkSheetProps = {
  onClose: () => void;
  url: string;
};
export const ExternalRealtimeMapSheet = ({
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
          expand={true}
          text={t(MapTexts.externalRealtimeMap.bottomSheet.button)}
          onPress={() => {
            Linking.openURL(url);
            onClose();
          }}
          rightIcon={{svg: ExternalLink}}
        />
      </ScrollView>
    </BottomSheetContainer>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    container: {
      backgroundColor: theme.color.background.neutral[1].background,
      marginHorizontal: theme.spacing.medium,
      marginBottom: Math.max(bottom, theme.spacing.medium),
    },
    contentContainer: {
      rowGap: theme.spacing.medium,
    },
  };
});
