import RecentTicketsScrollView from '@atb/screens/Ticketing/Tickets/RecentTickets/RecentTicketsScrollView';
import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import MessageBox from '@atb/components/message-box';
import ThemeText from '@atb/components/text';
import {TicketsTexts} from '@atb/translations';
import {useAppState} from '@atb/AppContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

const RecentTickets = () => {
  const appContext = useAppState();
  const enableTicketingOverlay = () => {
    appContext.resetTicketing();
  };
  const {must_upgrade_ticketing, enable_recent_tickets} = useRemoteConfig();

  return (
    <>
      {enable_recent_tickets ? (
        <RecentTicketsScrollView topElement={topMessage} />
      ) : (
        <View style={{flex: 1, padding: theme.spacings.medium}}>
          {topMessage}
        </View>
      )}
    </>
  );

  const topMessage = (
    <View style={{paddingBottom: theme.spacings.large}}>
      <MessageBox>
        <ThemeText
          type="body__primary"
          style={{color: theme.status.info.main.color}}
          isMarkdown={true}
        >
          {t(TicketsTexts.buyTicketsTab.reactivateSplash.message)}
        </ThemeText>

        <TouchableOpacity
          onPress={enableTicketingOverlay}
          accessibilityLabel={t(
            TicketsTexts.buyTicketsTab.reactivateSplash.linkA11yHint,
          )}
        >
          <ThemeText
            type="body__primary--underline"
            style={{color: theme.status.info.main.color}}
          >
            {t(TicketsTexts.buyTicketsTab.reactivateSplash.linkText)}
          </ThemeText>
        </TouchableOpacity>
      </MessageBox>
    </View>
  );
};

const TicketingMessage = () => {
  return (
    <View style={{flex: 1, padding: theme.spacings.medium}}>
      <View style={{paddingBottom: theme.spacings.large}}>
        <MessageBox>
          <ThemeText
            type="body__primary"
            style={{color: theme.status.info.main.color}}
            isMarkdown={true}
          >
            {t(TicketsTexts.buyTicketsTab.reactivateSplash.message)}
          </ThemeText>

          <TouchableOpacity
            onPress={enableTicketingOverlay}
            accessibilityLabel={t(
              TicketsTexts.buyTicketsTab.reactivateSplash.linkA11yHint,
            )}
          >
            <ThemeText
              type="body__primary--underline"
              style={{color: theme.status.info.main.color}}
            >
              {t(TicketsTexts.buyTicketsTab.reactivateSplash.linkText)}
            </ThemeText>
          </TouchableOpacity>
        </MessageBox>
      </View>
    </View>
  );
};
