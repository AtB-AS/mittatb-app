import {StyleSheet} from '@atb/theme';
import {TicketingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {Ticketing_TicketTabNavStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import {ScreenHeading} from '@atb/components/heading';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

export const Ticketing_RootScreen = () => {
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad();
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <FullScreenHeader
        textOpacity={0}
        globalMessageContext={GlobalMessageContextEnum.appTicketing}
      />
      <View style={styles.headingContainer}>
        <ScreenHeading
          ref={focusRef}
          text={t(TicketingTexts.header.title)}
          isLarge={true}
        />
      </View>
      <Ticketing_TicketTabNavStack />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
  },
  headingContainer: {
    paddingBottom: theme.spacing.medium,
  },
}));
