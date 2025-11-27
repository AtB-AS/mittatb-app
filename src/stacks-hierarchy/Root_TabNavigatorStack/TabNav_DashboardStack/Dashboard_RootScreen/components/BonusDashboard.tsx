import {useAnalyticsContext} from '@atb/modules/analytics';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {StyleSheet} from '@atb/theme';
import {DashboardTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {ContentHeading} from '@atb/components/heading';
import {UserBonusBalanceContent} from '@atb/modules/bonus';
import {useNavigateToNestedProfileScreen} from '@atb/utils/use-navigate-to-nested-profile-screen';

export const BonusDashboard = () => {
  const style = useStyle();
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();

  const navigateToBonusScreen = useNavigateToNestedProfileScreen(
    'Profile_BonusScreen',
  );

  return (
    <View style={style.contentSection}>
      <ContentHeading
        text={t(DashboardTexts.bonus.header)}
        style={style.heading}
      />
      <Section>
        <GenericSectionItem>
          <UserBonusBalanceContent />
        </GenericSectionItem>
        <LinkSectionItem
          text={t(DashboardTexts.bonus.button)}
          onPress={() => {
            analytics.logEvent('Bonus', 'Dashboard bonus info button clicked');
            navigateToBonusScreen();
          }}
        />
      </Section>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  contentSection: {
    marginTop: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
  heading: {
    marginBottom: theme.spacing.small,
  },
}));
