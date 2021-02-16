import {TRONDHEIM_CENTRAL_STATION} from '@atb/api/geocoder';
import {CurrentLocationArrow} from '@atb/assets/svg/icons/places';
import Button from '@atb/components/button';
import {
  MapCameraConfig,
  MapControls,
  MapViewConfig,
  PositionArrow,
  shadows,
} from '@atb/components/map';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {ButtonInput, Section} from '@atb/components/sections';
import ThemeIcon from '@atb/components/theme-icon';
import {useGeolocationState} from '@atb/GeolocationContext';
import {DismissableStackNavigationProp} from '@atb/navigation/createDismissableStackNavigator';
import {TariffZone} from '@atb/reference-data/types';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StyleSheet, useTheme} from '@atb/theme';
import colors from '@atb/theme/colors';
import {Language, TariffZonesTexts, useTranslation} from '@atb/translations';
import MapboxGL, {
  OnPressEvent,
  RegionPayload,
} from '@react-native-mapbox-gl/maps';
import {RouteProp} from '@react-navigation/native';
import turfCentroid from '@turf/centroid';
import {FeatureCollection, Polygon} from 'geojson';
import React, {useEffect, useRef, useState} from 'react';
import {PixelRatio, Platform, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TicketingStackParams} from '../';

type TariffZonesRouteName = 'TariffZones';
const TariffZonesRouteNameStatic: TariffZonesRouteName = 'TariffZones';

export type RouteParams = {
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
};

type RouteProps = RouteProp<TicketingStackParams, TariffZonesRouteName>;
type NavigationProps = DismissableStackNavigationProp<
  TicketingStackParams,
  TariffZonesRouteName
>;

export type TariffZoneResultType = 'venue' | 'geolocation' | 'zone';
export type TariffZoneWithMetadata = TariffZone & {
  resultType: TariffZoneResultType;
  venueName?: string;
};

export type TariffZonesProps = {
  navigation: NavigationProps;
  route: RouteProps;
};

type RegionEvent = {
  isMoving: boolean;
  region?: GeoJSON.Feature<GeoJSON.Point, RegionPayload>;
};

type TariffZoneSelection = {
  from: TariffZoneWithMetadata;
  to: TariffZoneWithMetadata;
  selectNext: 'from' | 'to';
};

const TariffZonesRoot: React.FC<TariffZonesProps> = ({navigation, route}) => {
  return <TariffZones navigation={navigation} route={route} />;
};

type Props = {
  navigation: NavigationProps;
  route: RouteProps;
};

export const tariffZonesSummary = (
  fromTariffZone: TariffZoneWithMetadata,
  toTariffZone: TariffZoneWithMetadata,
  language: Language,
) => {
  if (fromTariffZone.id === toTariffZone.id) {
    return TariffZonesTexts.zoneSummary.text.singleZone(
      getReferenceDataName(fromTariffZone, language),
    );
  } else {
    return TariffZonesTexts.zoneSummary.text.multipleZone(
      getReferenceDataName(fromTariffZone, language),
      getReferenceDataName(toTariffZone, language),
    );
  }
};

const departurePickerAccessibilityLabel = (
  fromTariffZone: TariffZoneWithMetadata,
  language: Language,
) => {
  if (fromTariffZone.venueName)
    return TariffZonesTexts.location.departurePicker.a11yLabel.withVenue(
      getReferenceDataName(fromTariffZone, language),
      fromTariffZone.venueName,
    );
  else {
    return TariffZonesTexts.location.departurePicker.a11yLabel.noVenue(
      getReferenceDataName(fromTariffZone, language),
    );
  }
};

const destinationPickerAccessibilityLabel = (
  toTariffZone: TariffZoneWithMetadata,
  language: Language,
) => {
  if (toTariffZone.venueName)
    return TariffZonesTexts.location.destinationPicker.a11yLabel.withVenue(
      getReferenceDataName(toTariffZone, language),
      toTariffZone.venueName,
    );
  else {
    return TariffZonesTexts.location.destinationPicker.a11yLabel.noVenue(
      getReferenceDataName(toTariffZone, language),
    );
  }
};

const departurePickerValue = (
  fromTariffZone: TariffZoneWithMetadata,
  language: Language,
) => {
  if (fromTariffZone.venueName)
    return TariffZonesTexts.location.departurePicker.value.withVenue(
      getReferenceDataName(fromTariffZone, language),
      fromTariffZone.venueName,
    );
  else {
    return TariffZonesTexts.location.departurePicker.value.noVenue(
      getReferenceDataName(fromTariffZone, language),
    );
  }
};

const destinationPickerValue = (
  fromTariffZone: TariffZoneWithMetadata,
  toTariffZone: TariffZoneWithMetadata,
  language: Language,
) => {
  if (fromTariffZone.id === toTariffZone.id && toTariffZone.venueName) {
    return TariffZonesTexts.location.destinationPicker.value.withVenueSameZone(
      toTariffZone.venueName,
    );
  } else if (fromTariffZone.id === toTariffZone.id && !toTariffZone.venueName) {
    return TariffZonesTexts.location.destinationPicker.value.noVenueSameZone;
  } else if (toTariffZone.venueName) {
    return TariffZonesTexts.location.departurePicker.value.withVenue(
      getReferenceDataName(toTariffZone, language),
      toTariffZone.venueName,
    );
  } else {
    return TariffZonesTexts.location.departurePicker.value.noVenue(
      getReferenceDataName(toTariffZone, language),
    );
  }
};

const TariffZones: React.FC<Props> = ({navigation, route: {params}}) => {
  const {fromTariffZone, toTariffZone} = params;
  const [regionEvent, setRegionEvent] = useState<RegionEvent>();
  const {tariff_zones: tariffZones} = useRemoteConfig();
  const [selectedZones, setSelectedZones] = useState<TariffZoneSelection>({
    from: fromTariffZone,
    to: toTariffZone,
    selectNext: 'to',
  });

  useEffect(() => {
    setSelectedZones({
      ...selectedZones,
      from: fromTariffZone,
    });
  }, [fromTariffZone]);

  useEffect(() => {
    setSelectedZones({
      ...selectedZones,
      to: toTariffZone,
    });
  }, [toTariffZone]);

  const {location: geolocation} = useGeolocationState();

  const {bottom: safeAreaBottom} = useSafeAreaInsets();

  const updateSelectedZones = (
    tariffZoneId: string,
    resultType: TariffZoneResultType = 'zone',
  ) => {
    const clickedTariffZone = tariffZones.find((t) => tariffZoneId === t.id)!;
    const newZoneSelection: TariffZoneSelection = {
      ...selectedZones,
      [selectedZones.selectNext]: {
        ...clickedTariffZone,
        resultType: resultType,
      },
      selectNext: selectedZones.selectNext === 'from' ? 'to' : 'from',
    };
    setSelectedZones(newZoneSelection);
  };

  const startCoordinates = geolocation
    ? [geolocation.coords.longitude, geolocation.coords.latitude]
    : [TRONDHEIM_CENTRAL_STATION.longitude, TRONDHEIM_CENTRAL_STATION.latitude];

  const onSave = () => {
    navigation.navigate('PurchaseOverview', {
      fromTariffZone: selectedZones.from,
      toTariffZone: selectedZones.to,
    });
  };

  const onVenueSearchClick = (callerRouteParam: keyof RouteParams) => {
    navigation.navigate('TariffZoneSearch', {
      label:
        callerRouteParam === 'fromTariffZone'
          ? t(TariffZonesTexts.location.departurePicker.label)
          : t(TariffZonesTexts.location.destinationPicker.label),
      callerRouteName: TariffZonesRouteNameStatic,
      callerRouteParam,
    });
  };

  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);

  async function zoomIn() {
    const currentZoom = await mapViewRef.current?.getZoom();
    mapCameraRef.current?.zoomTo((currentZoom ?? 10) + 1, 200);
  }

  async function zoomOut() {
    const currentZoom = await mapViewRef.current?.getZoom();
    mapCameraRef.current?.zoomTo((currentZoom ?? 10) - 1, 200);
  }

  const selectFeature = (event: OnPressEvent) => {
    const feature = event.features[0];
    mapCameraRef.current?.flyTo(
      [event.coordinates.longitude, event.coordinates.latitude],
      300,
    );
    updateSelectedZones(feature.id as string);
  };

  async function flyToCurrentLocation() {
    geolocation &&
      mapCameraRef.current?.flyTo(
        [geolocation.coords.longitude, geolocation.coords.latitude],
        750,
      );

    if (mapViewRef.current && geolocation) {
      let point = await mapViewRef.current.getPointInView([
        geolocation.coords.longitude,
        geolocation.coords.latitude,
      ]);
      if (Platform.OS == 'android') {
        // Necessary hack (https://github.com/react-native-mapbox-gl/maps/issues/1085)
        point = point.map((p) => p * PixelRatio.get());
      }
      const featuresAtPoint = await mapViewRef.current.queryRenderedFeaturesAtPoint(
        point,
        ['all', true],
        ['tariffZonesFill'],
      );
      const featureId = featuresAtPoint?.features?.[0]?.id;
      if (featureId) {
        updateSelectedZones(featureId as string, 'geolocation');
      }
    }
  }

  const styles = useMapStyles();
  const {t, language} = useTranslation();
  const {theme} = useTheme();

  const featureCollection = mapZonesToFeatureCollection(tariffZones, language);

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: theme.background.header}}>
        <FullScreenHeader
          title={t(TariffZonesTexts.header.title)}
          leftButton={{type: 'back'}}
        />

        <Section withPadding>
          <ButtonInput
            label={t(TariffZonesTexts.location.departurePicker.label)}
            value={t(departurePickerValue(selectedZones.from, language))}
            accessibilityLabel={t(
              departurePickerAccessibilityLabel(selectedZones.from, language),
            )}
            accessibilityHint={t(
              TariffZonesTexts.location.departurePicker.a11yHint,
            )}
            onPress={() => onVenueSearchClick('fromTariffZone')}
            icon={
              selectedZones.from.resultType === 'geolocation' ? (
                <ThemeIcon svg={CurrentLocationArrow} />
              ) : undefined
            }
          />
          <ButtonInput
            label={t(TariffZonesTexts.location.destinationPicker.label)}
            value={t(
              destinationPickerValue(
                selectedZones.from,
                selectedZones.to,
                language,
              ),
            )}
            accessibilityLabel={t(
              destinationPickerAccessibilityLabel(selectedZones.from, language),
            )}
            accessibilityHint={t(
              TariffZonesTexts.location.departurePicker.a11yHint,
            )}
            onPress={() => onVenueSearchClick('toTariffZone')}
            icon={
              selectedZones.to.resultType === 'geolocation' ? (
                <ThemeIcon svg={CurrentLocationArrow} />
              ) : undefined
            }
          />
        </Section>
      </View>

      <MapboxGL.MapView
        ref={mapViewRef}
        style={{
          flex: 1,
        }}
        onRegionDidChange={(region) => {
          setRegionEvent({isMoving: false, region});
        }}
        onRegionWillChange={() => {
          setRegionEvent({isMoving: true, region: regionEvent?.region});
        }}
        {...MapViewConfig}
      >
        <MapboxGL.ShapeSource
          id={'tariffZonesShape'}
          shape={featureCollection}
          hitbox={{width: 1, height: 1}} // to not be able to hit multiple zones with one click
          onPress={selectFeature}
        >
          <MapboxGL.FillLayer
            id="tariffZonesFill"
            style={{
              fillAntialias: true,
              fillColor: [
                // Mapbox Expression syntax
                'case',
                ['==', selectedZones.from.id, ['id']],
                colors.secondary.red_500,
                ['==', selectedZones.to.id, ['id']],
                colors.secondary.blue_500,
                'transparent',
              ],
              fillOpacity: 0.2,
            }}
          />
          <MapboxGL.LineLayer
            id="tariffZonesLine"
            style={{
              lineWidth: 1,
              lineColor: colors.primary.gray_400,
            }}
          />
        </MapboxGL.ShapeSource>
        {featureCollection.features.map((f) => (
          <MapboxGL.ShapeSource
            key={f.id}
            id={`label-shape-${f.id}`}
            shape={f.properties!.midPoint}
          >
            <MapboxGL.SymbolLayer
              id={`label-symbol-${f.id}`}
              style={{
                textSize: 20,
                textField: f.properties!.name,
                textHaloColor: 'white',
                textHaloWidth: 10,
              }}
            />
          </MapboxGL.ShapeSource>
        ))}
        <MapboxGL.Camera
          ref={mapCameraRef}
          zoomLevel={6}
          centerCoordinate={startCoordinates}
          {...MapCameraConfig}
        />
      </MapboxGL.MapView>

      <View style={[styles.bottomControls, {bottom: safeAreaBottom}]}>
        <View>
          <View style={styles.mapControls}>
            <PositionArrow flyToCurrentLocation={flyToCurrentLocation} />
            <MapControls zoomIn={zoomIn} zoomOut={zoomOut} />
          </View>
        </View>
        <View style={styles.saveButton}>
          <Button
            onPress={onSave}
            text={t(TariffZonesTexts.saveButton.text)}
            accessibilityHint={t(TariffZonesTexts.saveButton.a11yHint)}
          />
        </View>
      </View>
    </View>
  );
};

const mapZonesToFeatureCollection = (
  zones: TariffZone[],
  language: Language,
): FeatureCollection<Polygon> => ({
  type: 'FeatureCollection',
  features: zones.map((t) => ({
    type: 'Feature',
    id: t.id,
    properties: {
      name: getReferenceDataName(t, language),
      midPoint: turfCentroid(t.geometry, {
        properties: {name: getReferenceDataName(t, language)},
      }),
    },
    geometry: t.geometry,
  })),
});

const useMapStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1},
  pinContainer: {
    position: 'absolute',
    top: '50%',
    right: '50%',
  },
  pin: {position: 'absolute', top: 40, right: -20, ...shadows},
  bottomControls: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'flex-end',
  },
  mapControls: {
    position: 'absolute',
    bottom: theme.spacings.medium,
    right: theme.spacings.medium,
  },
  saveButton: {
    paddingBottom: theme.spacings.medium,
    marginHorizontal: theme.spacings.medium,
  },
}));

export default TariffZonesRoot;
