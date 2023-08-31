import {useAnnouncements} from '@atb/announcements/use-announcements';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {SectionHeading} from './SectionHeading';
import {ScrollView} from 'react-native-gesture-handler';
import {Image} from 'react-native';

export const Announcements = () => {
  const {language} = useTranslation();
  const {isLoading, error, announcements} = useAnnouncements();

  if (isLoading || !!error) return null;

  return (
    <>
      <SectionHeading>Aktuelt</SectionHeading>
      <ScrollView horizontal enabled={announcements.length > 1}>
        {announcements.map((a) => (
          <Section key={a.id} style={{minWidth: '80%', maxWidth: '100%'}}>
            <GenericClickableSectionItem onPress={() => console.log(a)}>
              {a.summaryImageUrl && <Image source={{uri: a.summaryImageUrl}} />}
              <ThemeText type="body__primary--bold">
                {getTextForLanguage(a.summaryTitle ?? a.fullTitle, language)}
              </ThemeText>
              <ThemeText>{getTextForLanguage(a.summary, language)}</ThemeText>
            </GenericClickableSectionItem>
          </Section>
        ))}
      </ScrollView>
    </>
  );
};
