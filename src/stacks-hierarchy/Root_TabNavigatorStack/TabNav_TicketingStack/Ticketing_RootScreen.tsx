import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {TicketingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {Ticketing_TicketTabNavStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack';

export const Ticketing_RootScreen = () => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TicketingTexts.header.title)}
        rightButton={{type: 'chat'}}
        globalMessageContext="app-ticketing"
      />
      <Ticketing_TicketTabNavStack />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_accent_0.background,
  },
}));
