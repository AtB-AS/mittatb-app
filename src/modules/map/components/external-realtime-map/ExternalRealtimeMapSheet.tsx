import {dictionary, MapTexts, useTranslation} from '@atb/translations';
import {Linking} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {Button} from '@atb/components/button';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeText} from '@atb/components/text';
import {ScrollView} from 'react-native-gesture-handler';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {BottomSheetMap} from '@atb/components/bottom-sheet-map';
import {Close} from '@atb/assets/svg/mono-icons/actions';

type ExternalRealtimeMapLinkSheetProps = {
  onClose: () => void;
  url: string;
  positionArrowCallback: () => void;
};
export const ExternalRealtimeMapSheet = ({
  onClose,
  url,
  positionArrowCallback,
}: ExternalRealtimeMapLinkSheetProps) => {
  const {t} = useTranslation();
  const style = useStyle();

  return (
    <BottomSheetMap
      closeCallback={onClose}
      allowBackgroundTouch={false}
      heading={t(MapTexts.externalRealtimeMap.bottomSheet.heading)}
      rightIconText={t(dictionary.appNavigation.close.text)}
      rightIcon={Close}
      positionArrowCallback={positionArrowCallback}
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
    </BottomSheetMap>
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
