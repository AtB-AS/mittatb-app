import {ScreenHeading} from '@atb/components/heading';
import {FullScreenView} from '@atb/components/screen-view';
import { GenericSectionItem, HeaderSectionItem, MessageSectionItem, Section } from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import { useFirestoreConfiguration } from '@atb/configuration';
import {StyleSheet, Theme} from '@atb/theme';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import TravelAidSettingsTexts from '@atb/translations/screens/subscreens/TravelAidSettingsTexts';
import {View} from 'react-native';

export const Profile_TravelAidInformationScreen = () => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const {appTexts} = useFirestoreConfiguration();

  const howToTitle = appTexts?.getAppText('travelAidHowToTitle');
  const howToContent = appTexts?.getAppText('travelAidHowToContent');

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
        <HeaderSectionItem 
        text={getTextForLanguage(howToTitle, language) ?? ''}
        />      
        <GenericSectionItem>
            <ThemeText>
            {getTextForLanguage(howToContent, language) ?? ''}

            </ThemeText>
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
