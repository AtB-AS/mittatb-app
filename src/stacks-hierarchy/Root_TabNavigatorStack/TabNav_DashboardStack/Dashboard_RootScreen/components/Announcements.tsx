import {useAnnouncements} from '@atb/announcements/use-announcements';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {ScrollView} from 'react-native-gesture-handler';
import {Announcement} from './Announcement';
import {AnnouncementSheet} from './AnnouncementSheet';
import {SectionHeading} from './SectionHeading';
import {StyleSheet} from '@atb/theme';

export const Announcements = () => {
  const {isLoading, error, announcements} = useAnnouncements();
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const style = useStyle();

  if (isLoading || !!error) return null;

  return (
    <>
      <SectionHeading>Aktuelt</SectionHeading>
      <ScrollView>
        {announcements.map((a, i) => (
          <Section
            key={a.id}
            style={i < announcements.length - 1 && style.announcement}
          >
            <GenericClickableSectionItem
              onPress={() =>
                openBottomSheet(() => (
                  <AnnouncementSheet
                    announcement={a}
                    close={closeBottomSheet}
                  />
                ))
              }
            >
              <Announcement announcement={a} />
            </GenericClickableSectionItem>
          </Section>
        ))}
      </ScrollView>
    </>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  return {
    announcement: {
      marginBottom: theme.spacings.medium,
    },
  };
});
