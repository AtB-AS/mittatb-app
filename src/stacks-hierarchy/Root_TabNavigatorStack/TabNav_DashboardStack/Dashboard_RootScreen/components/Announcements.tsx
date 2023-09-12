import {StyleProp, View, ViewStyle} from 'react-native';
import {useAnnouncementsState} from '@atb/announcements';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {ScrollView} from 'react-native-gesture-handler';
import {Announcement} from './Announcement';
import {AnnouncementSheet} from './AnnouncementSheet';
import {SectionHeading} from './SectionHeading';
import {StyleSheet} from '@atb/theme';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const Announcements = ({style: containerStyle}: Props) => {
  const {announcements} = useAnnouncementsState();
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const style = useStyle();

  if (announcements.length === 0) return null;

  return (
    <View style={containerStyle}>
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
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  return {
    announcement: {
      marginBottom: theme.spacings.medium,
    },
  };
});
