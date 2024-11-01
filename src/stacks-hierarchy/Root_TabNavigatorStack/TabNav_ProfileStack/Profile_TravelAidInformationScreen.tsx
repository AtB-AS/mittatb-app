import {ScreenHeading} from '@atb/components/heading';
import {FullScreenView} from '@atb/components/screen-view';
import {
  GenericSectionItem,
  HeaderSectionItem,
  Section,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import TravelAidSettingsTexts from '@atb/translations/screens/subscreens/TravelAidSettingsTexts';
import {View} from 'react-native';

export const Profile_TravelAidInformationScreen = () => {
  const styles = useStyles();
  const {t} = useTranslation();

  const howToTitle = t(TravelAidSettingsTexts.information.howTo.title);
  const howToContent = t(TravelAidSettingsTexts.information.howTo.content);
  const keepInMindTitle = t(
    TravelAidSettingsTexts.information.keepInMind.title,
  );
  const keepInMindContent = t(
    TravelAidSettingsTexts.information.keepInMind.content,
  );

  return (
    <FullScreenView
      headerProps={{
        title: t(TravelAidSettingsTexts.header.howTo.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(TravelAidSettingsTexts.header.howTo.title)}
        />
      )}
    >
      <View style={styles.content}>
        <Section>
          <HeaderSectionItem text={howToTitle} />
          <GenericSectionItem>
            <ThemeText isMarkdown>{howToContent}</ThemeText>
          </GenericSectionItem>
        </Section>
        <Section>
          <HeaderSectionItem text={keepInMindTitle} />
          <GenericSectionItem>
            <ThemeText isMarkdown>{keepInMindContent}</ThemeText>
          </GenericSectionItem>
        </Section>
      </View>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    margin: theme.spacing.medium,
    rowGap: theme.spacing.small,
  },
  buttonContainer: {
    rowGap: theme.spacing.medium,
    flex: 1,
  },
}));
