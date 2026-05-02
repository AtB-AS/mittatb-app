import {MapTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {Button} from '@atb/components/button';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeText} from '@atb/components/text';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {openUrl} from '@atb/utils/open-url';

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
    <View style={style.container}>
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
          openUrl(url);
          onClose();
        }}
        rightIcon={{svg: ExternalLink}}
      />
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      backgroundColor: theme.color.background.neutral[1].background,
      marginHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
      rowGap: theme.spacing.medium,
    },
  };
});
