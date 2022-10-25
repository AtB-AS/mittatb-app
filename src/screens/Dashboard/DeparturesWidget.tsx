import {Add, Edit} from '@atb/assets/svg/mono-icons/actions';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import QuaySection from '@atb/departure-list/section-items/quay-section';
import {useFavorites} from '@atb/favorites';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import SelectFavouritesBottomSheet from '@atb/screens/Assistant/SelectFavouritesBottomSheet';
import {StyleSheet} from '@atb/theme';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import React, {useEffect, useRef} from 'react';
import {ActivityIndicator, Linking, TouchableOpacity, View} from 'react-native';
import {useFavoriteDepartureData} from './state';
import {NoFavouriteDeparture} from '@atb/assets/svg/color/images/';
import * as Sections from '@atb/components/sections';
import ThemeIcon from '@atb/components/theme-icon';
import {NavigationProp} from "@react-navigation/native";

type Props = {
  navigation: NavigationProp<any>;
};
const DeparturesWidget: React.FC<Props> = ({navigation}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {new_favourites_info_url} = useRemoteConfig();
  const {favoriteDepartures} = useFavorites();
  const {location} = useGeolocationState();
  const {state, loadInitialDepartures, searchDate} = useFavoriteDepartureData();

  useEffect(() => loadInitialDepartures(), [favoriteDepartures]);

  const {open: openBottomSheet} = useBottomSheet();
  const closeRef = useRef(null);
  async function openFrontpageFavouritesBottomSheet() {
    openBottomSheet((close) => {
      return (
        <SelectFavouritesBottomSheet close={close} navigation={navigation} />
      );
    }, closeRef);
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
        <Sections.Section>
          <Sections.GenericItem>
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
          </Sections.GenericItem>
          <Sections.LinkItem
            text={t(FavoriteDeparturesTexts.favoriteItemAdd.label)}
            onPress={() => {
              navigation.navigate('NearbyDeparturesScreen');
            }}
            icon={<ThemeIcon svg={Add} />}
            testID="chooseLoginPhone"
          />
        </Sections.Section>
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
                  locationOrStopPlace={location || undefined}
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
          ref={closeRef}
        />
      )}
    </View>
  );
};

export default DeparturesWidget;

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
  },
  heading: {
    marginTop: theme.spacings.large,
    marginBottom: theme.spacings.medium,
  },
  noFavouritesView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noFavouritesTextContainer: {
    flex: 1,
    paddingVertical: theme.spacings.small,
  },
  noFavouritesUrl: {
    marginVertical: theme.spacings.xSmall,
  },
  activityIndicator: {
    marginVertical: theme.spacings.medium,
  },
}));
