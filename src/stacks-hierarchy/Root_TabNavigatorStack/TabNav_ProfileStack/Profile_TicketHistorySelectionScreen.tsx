import {ScreenHeading} from '@atb/components/heading';
import {FullScreenView} from '@atb/components/screen-view';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {useTranslation} from '@atb/translations';
import Ticketing, {
  TicketHistoryModeTexts,
} from '@atb/translations/screens/Ticketing';
import {ProfileScreenProps} from './navigation-types';
import {StyleSheet} from '@atb/theme';
import {useFeatureTogglesContext} from '@atb/feature-toggles';

type Props = ProfileScreenProps<'Profile_TicketHistorySelectionScreen'>;

export const Profile_TicketHistorySelectionScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();

  const {isOnBehalfOfEnabled} = useFeatureTogglesContext();

  return (
    <FullScreenView
      headerProps={{
        title: t(Ticketing.ticketHistory.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading ref={focusRef} text={t(Ticketing.ticketHistory.title)} />
      )}
    >
      <Section style={styles.content}>
        <LinkSectionItem
          text={t(TicketHistoryModeTexts.expired.title)}
          accessibility={{
            accessibilityHint: t(TicketHistoryModeTexts.expired.titleA11y),
          }}
          testID="expiredTicketsButton"
          onPress={() =>
            navigation.navigate('Profile_TicketHistoryScreen', {
              mode: 'expired',
            })
          }
        />
        {isOnBehalfOfEnabled && (
          <LinkSectionItem
            text={t(TicketHistoryModeTexts.sent.title)}
            accessibility={{
              accessibilityHint: t(TicketHistoryModeTexts.sent.titleA11y),
            }}
            testID="sentToOthersButton"
            onPress={() =>
              navigation.navigate('Profile_TicketHistoryScreen', {mode: 'sent'})
            }
          />
        )}
      </Section>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  content: {flex: 1, padding: theme.spacing.medium},
}));
