import {useAnnouncements} from '@atb/announcements/use-announcements';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {ScrollView} from 'react-native-gesture-handler';
import {SectionHeading} from './SectionHeading';
import {Announcement} from './Announcement';

export const Announcements = () => {
  const {isLoading, error, announcements} = useAnnouncements();

  if (isLoading || !!error) return null;

  return (
    <>
      <SectionHeading>Aktuelt</SectionHeading>
      <ScrollView horizontal enabled={announcements.length > 1}>
        {announcements.map((a) => (
          <Section key={a.id} style={{minWidth: '80%', maxWidth: '100%'}}>
            <GenericClickableSectionItem onPress={() => console.log(a)}>
              <Announcement announcement={a} />
            </GenericClickableSectionItem>
          </Section>
        ))}
      </ScrollView>
    </>
  );
};
