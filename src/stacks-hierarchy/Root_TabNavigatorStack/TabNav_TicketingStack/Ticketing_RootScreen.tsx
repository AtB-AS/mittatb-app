import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {TicketingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {Ticketing_TicketTabNavStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';

export const Ticketing_RootScreen = () => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TicketingTexts.header.title)}
        globalMessageContext={GlobalMessageContextEnum.appTicketing}
      />
      <Ticketing_TicketTabNavStack />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.accent[0].background,
  },
}));
