import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet, Theme} from '@atb/theme';
import {TravelTokenTexts, useTranslation} from '@atb/translations';
import TravelTokenBox from '@atb/travel-token-box';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ProfileScreenProps} from '../types';
import {FaqSection} from '@atb/screens/Profile/TravelToken/FaqSection';
import {ChangeTokenAction} from '@atb/screens/Profile/TravelToken/ChangeTokenAction';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {useIsFocused} from '@react-navigation/native';

type TravelCardScreenProps = ProfileScreenProps<'TravelToken'>;

export default function TravelCard({navigation}: TravelCardScreenProps) {
  const styles = useStyles();
  const {t} = useTranslation();
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [toggleLimit, setToggleLimit] = useState<number | undefined>();
  const [maxToggleLimit, setMaxToggleLimit] = useState<number | undefined>();

  const {isError, isLoading, getTokenToggleDetails} =
    useMobileTokenContextState();
  const screenHasFocus = useIsFocused();

  useEffect(() => {
    const fetchToggleLimit = async () => {
      setShowLoader(true);
      const toggleToggleDetails = await getTokenToggleDetails();
      if (toggleToggleDetails) {
        const {toggleMaxLimit, toggledCount} = toggleToggleDetails;
        if (toggleMaxLimit && toggleMaxLimit >= toggledCount) {
          setToggleLimit(toggleMaxLimit - toggledCount);
        }
        setMaxToggleLimit(toggleMaxLimit);
      }
      setShowLoader(false);
    };
    if (!isError && !isLoading) {
      fetchToggleLimit();
    }
  }, [getTokenToggleDetails, screenHasFocus]);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TravelTokenTexts.travelToken.header.title)}
        leftButton={{type: 'back'}}
      />
      <ScrollView style={styles.scrollView}>
        <TravelTokenBox showIfThisDevice={true} alwaysShowErrors={true} />
        <ChangeTokenAction
          onChange={() => navigation.navigate('SelectTravelToken')}
          toggleLimit={toggleLimit}
          showLoader={showLoader}
        />
        <FaqSection toggleMaxLimit={maxToggleLimit} />
      </ScrollView>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_accent_0.background,
    flex: 1,
  },
  scrollView: {
    padding: theme.spacings.medium,
  },
}));
