import {StyleSheet} from '@atb/theme';
import {TicketingTexts, useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {Ticketing_TicketTabNavStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import {ScreenHeading} from '@atb/components/heading';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {TicketingScreenProps} from './navigation-types';
import {useNestedProfileScreenParams} from '@atb/utils/use-nested-profile-screen-params';
import {BonusBalanceButton} from '@atb/modules/bonus';

type Props = TicketingScreenProps<'Ticketing_RootScreen'>;

export const Ticketing_RootScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad();
  const styles = useStyles();

  const bonusScreenParams = useNestedProfileScreenParams('Profile_BonusScreen');

  const onNavigateToBonusScreen = useCallback(() => {
    navigation.navigate('Root_TabNavigatorStack', bonusScreenParams);
  }, [navigation, bonusScreenParams]);

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
        <BonusBalanceButton onPress={onNavigateToBonusScreen} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
}));
