import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet, Theme} from '@atb/theme';
import {TravelTokenTexts, useTranslation} from '@atb/translations';
import {TravelTokenBox} from '@atb/travel-token-box';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ProfileScreenProps} from '../navigation-types';
import {FaqSection} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_TravelTokenScreen/FaqSection';
import {ChangeTokenAction} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_TravelTokenScreen/ChangeTokenAction';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {useIsFocused} from '@react-navigation/native';
import {useTokenToggleDetails} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_TravelTokenScreen/use-token-toggle-details';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

type Props = ProfileScreenProps<'Profile_TravelTokenScreen'>;

export const Profile_TravelTokenScreen = ({navigation}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {isError, isLoading} = useMobileTokenContextState();
  const screenHasFocus = useIsFocused();
  const {disable_travelcard} = useRemoteConfig();
  const shouldFetchTokenDetails = screenHasFocus && !isError && !isLoading;
  const {shouldShowLoader, toggleLimit, maxToggleLimit} = useTokenToggleDetails(
    shouldFetchTokenDetails,
  );
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
        <TravelTokenBox showIfThisDevice={true} alwaysShowErrors={true} />
        <ChangeTokenAction
          onChange={() =>
            navigation.navigate('Profile_SelectTravelTokenScreen')
          }
          toggleLimit={toggleLimit}
          shouldShowLoader={shouldShowLoader}
        />
        <FaqSection toggleMaxLimit={maxToggleLimit} />
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
