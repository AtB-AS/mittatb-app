import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet, Theme} from '@atb/theme';
import {TravelTokenTexts, useTranslation} from '@atb/translations';
import {TravelTokenBox} from '@atb/travel-token-box';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {FaqSection} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_TravelTokenScreen/FaqSection';
import {ChangeTokenAction} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_TravelTokenScreen/ChangeTokenAction';
import {useTokenToggleDetailsQuery} from '@atb/mobile-token/use-token-toggle-details';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

export const Profile_TravelTokenScreen = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {disable_travelcard} = useRemoteConfig();
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
          interactiveColor="interactive_0"
        />
        <ChangeTokenAction />
        <FaqSection toggleMaxLimit={data?.maxToggleLimit} />
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_accent_0.background,
    flex: 1,
  },
  scrollView: {
    padding: theme.spacings.medium,
  },
}));
