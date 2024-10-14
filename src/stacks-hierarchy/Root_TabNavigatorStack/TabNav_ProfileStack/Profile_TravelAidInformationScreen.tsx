import {ScreenHeading} from '@atb/components/heading';
import {FullScreenView} from '@atb/components/screen-view';
import {
  GenericSectionItem,
  HeaderSectionItem,
  Section,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useFirestoreConfiguration} from '@atb/configuration';
import {StyleSheet, Theme} from '@atb/theme';
import {getUnescapedTextForLanguage, useTranslation} from '@atb/translations';
import TravelAidSettingsTexts from '@atb/translations/screens/subscreens/TravelAidSettingsTexts';
import {View} from 'react-native';

export const Profile_TravelAidInformationScreen = () => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const {appTexts} = useFirestoreConfiguration();

  const howToTitle =
    getUnescapedTextForLanguage(
      appTexts?.getAppText('travelAidHowToTitle'),
      language,
    ) ?? t(TravelAidSettingsTexts.information.howTo.title);
  const howToContent =
    getUnescapedTextForLanguage(
      appTexts?.getAppText('travelAidHowToContent'),
      language,
    ) ?? t(TravelAidSettingsTexts.information.howTo.content);

  const keepInMindTitle =
    getUnescapedTextForLanguage(
      appTexts?.getAppText('travelAidKeepInMindTitle'),
      language,
    ) ?? t(TravelAidSettingsTexts.information.keepInMind.title);
  const keepInMindContent =
    getUnescapedTextForLanguage(
      appTexts?.getAppText('travelAidKeepInMindContent'),
      language,
    ) ?? t(TravelAidSettingsTexts.information.keepInMind.content);

  return (
    <FullScreenView
      headerProps={{
        title: t(TravelAidSettingsTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(TravelAidSettingsTexts.header.title)}
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
    margin: theme.spacings.medium,
    rowGap: theme.spacings.small,
  },
  buttonContainer: {
    rowGap: theme.spacings.medium,
    flex: 1,
  },
}));
