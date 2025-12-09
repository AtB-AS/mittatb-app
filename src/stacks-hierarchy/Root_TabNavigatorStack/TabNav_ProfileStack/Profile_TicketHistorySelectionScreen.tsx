import {ScreenHeading} from '@atb/components/heading';
import {FullScreenView} from '@atb/components/screen-view';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {useTranslation} from '@atb/translations';
import Ticketing, {
  TicketHistoryModeTexts,
} from '@atb/translations/screens/Ticketing';
import {ProfileScreenProps} from './navigation-types';
import {StyleSheet} from '@atb/theme';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

type Props = ProfileScreenProps<'Profile_TicketHistorySelectionScreen'>;

export const Profile_TicketHistorySelectionScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();

  const {isOnBehalfOfEnabled} = useFeatureTogglesContext();

  const focusRef = useFocusOnLoad(navigation);

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(Ticketing.ticketHistory.title),
        leftButton: {type: 'back'},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading ref={focusRef} text={t(Ticketing.ticketHistory.title)} />
      )}
    >
      <Section style={styles.content}>
        <LinkSectionItem
          text={t(TicketHistoryModeTexts.historical.title)}
          accessibility={{
            accessibilityHint: t(TicketHistoryModeTexts.historical.titleA11y),
          }}
          testID="historicTicketsButton"
          onPress={() =>
            navigation.navigate('Profile_TicketHistoryScreen', {
              mode: 'historical',
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
