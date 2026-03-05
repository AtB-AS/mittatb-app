import React, {useEffect} from 'react';
import {useActiveShmoBookingQuery} from '@atb/modules/mobility';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {ActivityIndicator, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {ONE_SECOND_MS} from '@atb/utils/durations';
import {ShmoBookingState} from '@atb/api/types/mobility';
import {MapTexts, useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {MapScreenProps} from './navigation-types';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Parking} from '@atb/assets/svg/mono-icons/places';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemedCityBike} from '@atb/theme/ThemedAssets';
import {LinkSectionItem} from '@atb/components/sections';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';

type Props = MapScreenProps<'Map_CityBikeStartTripScreen'>;

export const Map_CityBikeStartTripScreen = ({navigation}: Props) => {
  const styles = useStyle();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const focusRef = useFocusOnLoad(navigation);
  const isFocusedAndActive = useIsFocusedAndActive();

  const {
    data: activeBooking,
    isLoading,
    isError,
  } = useActiveShmoBookingQuery(isFocusedAndActive, ONE_SECOND_MS * 10);

  useEffect(() => {
    if (
      activeBooking &&
      activeBooking?.state !== ShmoBookingState.NOT_STARTED
    ) {
      navigation.goBack();
    }
  }, [activeBooking, navigation]);

  if (isLoading) {
    return (
      <View style={styles.fullScreenWrapper}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.fullScreenWrapper}>
        <MessageInfoBox
          type="error"
          message={t(MobilityTexts.loadingBookingFailed)}
        />
        <Button
          text={t(MapTexts.exitButton.a11yLabel)}
          expanded
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(MobilityTexts.cityBike.startTripView.header),
      }}
    >
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.title}>
            <ThemeIcon size="large" svg={Parking} />
            <ThemeText style={theme.typography.heading__xl}>
              {t(MobilityTexts.cityBike.location(1))}
            </ThemeText>
          </View>
          <ThemedCityBike />
          <View style={styles.content}>
            <ThemeText style={theme.typography.heading__xl}>
              {t(MobilityTexts.cityBike.startTripView.title)}
            </ThemeText>
            <ThemeText>
              {t(MobilityTexts.cityBike.startTripView.description)}
            </ThemeText>
            <ThemeText>
              {t(MobilityTexts.cityBike.startTripView.safeTrip)}
            </ThemeText>
          </View>
        </View>
        <View style={styles.supportButton}>
          <LinkSectionItem
            text={t(MobilityTexts.helpText)}
            onPress={() => {
              /* Will add when support for city bike is implemented */
            }}
            radius="top-bottom"
          />
        </View>
      </View>
    </FullScreenView>
  );
};
const useStyle = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.xLarge,
    },
    contentWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 48,
    },
    title: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.small,
      fontSize: theme.typography.heading__xl,
    },
    content: {
      alignItems: 'center',
      flexDirection: 'column',
      gap: theme.spacing.medium,
    },

    supportButton: {
      width: '100%',
      marginTop: 'auto',
      paddingBottom: theme.spacing.xLarge,
    },
    fullScreenWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xLarge,
      gap: theme.spacing.large,
    },
  };
});
