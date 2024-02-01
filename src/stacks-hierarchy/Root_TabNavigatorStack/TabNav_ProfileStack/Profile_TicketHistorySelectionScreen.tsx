import {ScreenHeading} from '@atb/components/heading';
import {FullScreenView} from '@atb/components/screen-view';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {useTranslation} from '@atb/translations';
import Ticketing from '@atb/translations/screens/Ticketing';
import TicketHistoryTexts from '@atb/translations/screens/subscreens/TicketHistory';
import {ProfileScreenProps} from './navigation-types';
import {StyleSheet} from '@atb/theme';
import {useOnBehalfOf} from '@atb/on-behalf-of';

type Props = ProfileScreenProps<'Profile_TicketHistorySelectionScreen'>;

export const Profile_TicketHistorySelectionScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();

  const isOnBehalfOfEnabled = useOnBehalfOf();

  return (
    <FullScreenView
      headerProps={{
        title: t(TicketHistoryTexts.header),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading ref={focusRef} text={t(TicketHistoryTexts.header)} />
      )}
    >
      <Section style={styles.content}>
        <LinkSectionItem
          text={t(Ticketing.expiredTickets.title)}
          accessibility={{
            accessibilityHint: t(Ticketing.expiredTickets.a11yHint),
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
            text={t(Ticketing.sentToOthers.title)}
            accessibility={{
              accessibilityHint: t(Ticketing.sentToOthers.a11yHint),
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
  content: {flex: 1, padding: theme.spacings.medium},
}));
