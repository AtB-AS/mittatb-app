import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {TravelTokenTexts, useTranslation} from '@atb/translations';
import {TravelTokenBox} from '@atb/travel-token-box';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {FaqSection} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_TravelTokenScreen/FaqSection';

import {useTokenToggleDetailsQuery} from '@atb/mobile-token/use-token-toggle-details';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {Section, GenericSectionItem} from '@atb/components/sections';
import {TokenToggleInfo} from '@atb/token-toggle-info';

export const Profile_TravelTokenScreen = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const {disable_travelcard} = useRemoteConfigContext();
  const {data} = useTokenToggleDetailsQuery();

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={
          disable_travelcard
            ? t(TravelTokenTexts.travelToken.header.titleWithoutTravelcard)
            : t(TravelTokenTexts.travelToken.header.title)
        }
        leftButton={{type: 'back'}}
      />
      <ScrollView style={styles.scrollView}>
        <TravelTokenBox
          showIfThisDevice={true}
          alwaysShowErrors={true}
          interactiveColor={theme.color.interactive[0]}
        />
        <Section style={styles.tokenInfoSection}>
          {data?.toggleLimit !== undefined && (
            <GenericSectionItem>
              <TokenToggleInfo style={styles.tokenInfoView} />
            </GenericSectionItem>
          )}
        </Section>
        <FaqSection toggleMaxLimit={data?.maxToggleLimit} />
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.color.background.accent[0].background,
    flex: 1,
  },
  scrollView: {
    padding: theme.spacing.medium,
  },
  tokenInfoSection: {
    marginBottom: theme.spacing.medium,
  },
  tokenInfoView: {flexDirection: 'row'},
}));
