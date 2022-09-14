import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import QuaySection from '@atb/departure-list/section-items/quay-section';
import {useFavorites} from '@atb/favorites';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import SelectFavouritesBottomSheet from '@atb/screens/Assistant/SelectFavouritesBottomSheet';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import React, {useEffect} from 'react';
import {ActivityIndicator, Linking, TouchableOpacity, View} from 'react-native';
import {useFavoriteDepartureData} from './state';
import {NoFavouriteDeparture} from '@atb/assets/svg/color/images/';

const FavouritesWidget: React.FC = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {new_favourites_info_url} = useRemoteConfig();
  const {favoriteDepartures} = useFavorites();
  const {location} = useGeolocationState();
  const {state, loadInitialDepartures, searchDate} = useFavoriteDepartureData();

  useEffect(() => loadInitialDepartures(), [favoriteDepartures]);

  const {open: openBottomSheet} = useBottomSheet();
  async function openFrontpageFavouritesBottomSheet() {
    openBottomSheet((close) => {
      return <SelectFavouritesBottomSheet close={close} />;
    });
  }

  const openAppInfoUrl = () => Linking.openURL(new_favourites_info_url);

  return (
    <View style={styles.container}>
      <ThemeText
        type="body__secondary"
        color="background_accent_0"
        style={styles.heading}
      >
        {t(DeparturesTexts.widget.heading)}
      </ThemeText>

      {!favoriteDepartures.length && (
        <View
          style={styles.noFavouritesView}
          accessible={true}
          accessibilityRole="link"
          accessibilityActions={[{name: 'activate'}]}
          onAccessibilityAction={openAppInfoUrl}
          accessibilityLabel={
            t(DeparturesTexts.message.noFavouritesWidget) +
            ' ' +
            t(DeparturesTexts.message.readMoreUrl)
          }
        >
          <NoFavouriteDeparture />
          <View style={styles.noFavouritesTextContainer}>
            <ThemeText>
              {t(DeparturesTexts.message.noFavouritesWidget)}
            </ThemeText>
            {new_favourites_info_url && (
              <TouchableOpacity
                onPress={openAppInfoUrl}
                importantForAccessibility={'no'}
              >
                <ThemeText
                  color="background_0"
                  type="body__primary--underline"
                  style={styles.noFavouritesUrl}
                >
                  {t(DeparturesTexts.message.readMoreUrl)}
                </ThemeText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {state.isLoading && (
        <ActivityIndicator size="large" style={styles.activityIndicator} />
      )}

      {state.data?.map((stopPlaceGroup) => {
        const stopPlaceInfo = stopPlaceGroup.stopPlace;
        return (
          <View key={stopPlaceGroup.stopPlace.id}>
            {stopPlaceGroup.quays.map((quay) => {
              return (
                <QuaySection
                  key={quay.quay.id}
                  quayGroup={quay}
                  stop={stopPlaceInfo}
                  searchDate={searchDate}
                  currentLocation={location || undefined}
                  mode="frontpage"
                />
              );
            })}
          </View>
        );
      })}

      {!!favoriteDepartures.length && (
        <Button
          mode="secondary"
          type="block"
          onPress={openFrontpageFavouritesBottomSheet}
          text={t(DeparturesTexts.button.text)}
          icon={Edit}
          iconPosition="right"
        />
      )}
    </View>
  );
};

export default FavouritesWidget;

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
  },
  heading: {
    marginTop: theme.spacings.large,
    marginBottom: theme.spacings.medium,
  },
  noFavouritesView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.border.radius.regular,
    padding: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  noFavouritesTextContainer: {
    flex: 1,
  },
  noFavouritesUrl: {
    marginVertical: theme.spacings.xSmall,
  },
  activityIndicator: {
    marginVertical: theme.spacings.medium,
  },
}));
