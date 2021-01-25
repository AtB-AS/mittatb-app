import MapboxGL, {RegionPayload} from '@react-native-mapbox-gl/maps';
import {RouteProp} from '@react-navigation/native';
import {Feature, FeatureCollection, Polygon} from 'geojson';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {PixelRatio, Platform, View} from 'react-native';
import {ArrowLeft, ArrowRight} from '../assets/svg/icons/navigation';
import {
  MapCameraConfig,
  MapControls,
  MapViewConfig,
  PositionArrow,
  shadows,
  useControlPositionsStyle,
} from '../components/map/';
import ThemeIcon from '../components/theme-icon';
import FullScreenHeader from '../ScreenHeader/full-header';
import {StyleSheet} from '../theme';
import {
  Language,
  TariffZoneMapSelectionTexts,
  useTranslation,
} from '../translations';
import {ButtonInput, Section} from '../components/sections';
import {TariffZone} from '../reference-data/types';
import {
  TariffZoneSearchNavigationProp,
  TariffZoneSearchStackParams,
} from './index';
import {useRemoteConfig} from '../RemoteConfigContext';
import {TRONDHEIM_CENTRAL_STATION} from '../api/geocoder';
import colors from '../theme/colors';
import {useGeolocationState} from '../GeolocationContext';
import {Coordinates} from '@entur/sdk';
import {getNameInLanguage} from '../api/utils';

export type RouteParams = {
  callerRouteName: string;
  callerRouteParam: string;
};

export type Props = {
  navigation: TariffZoneSearchNavigationProp;
  route: RouteProp<TariffZoneSearchStackParams, 'TariffZoneMapSelection'>;
};

type RegionEvent = {
  isMoving: boolean;
  region?: GeoJSON.Feature<GeoJSON.Point, RegionPayload>;
};

const TariffZoneMapSelection: React.FC<Props> = ({
  navigation,
  route: {params},
}) => {
  const {callerRouteName, callerRouteParam} = params;
  const [regionEvent, setRegionEvent] = useState<RegionEvent>();
  const [highlightedTariffZone, setHighlightedTariffZone] = useState<
    TariffZone | undefined
  >();
  const {tariff_zones: tariffZones} = useRemoteConfig();
  const {location: geolocation} = useGeolocationState();

  const centeredCoordinates = useMemo<Coordinates | null>(
    () =>
      (regionEvent?.region?.geometry && {
        latitude: regionEvent.region.geometry.coordinates[1],
        longitude: regionEvent.region.geometry.coordinates[0],
      }) ??
      null,
    [
      regionEvent?.region?.geometry?.coordinates[0],
      regionEvent?.region?.geometry?.coordinates[1],
    ],
  );

  const startCoordinates = geolocation
    ? [geolocation.coords.longitude, geolocation.coords.latitude]
    : [TRONDHEIM_CENTRAL_STATION.longitude, TRONDHEIM_CENTRAL_STATION.latitude];

  const onSelectZone = () => {
    if (highlightedTariffZone) {
      navigation.navigate(callerRouteName as any, {
        [callerRouteParam]: {
          ...highlightedTariffZone,
          resultType: 'zone',
        },
      });
    }
  };

  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);

  useEffect(() => {
    (async function () {
      if (centeredCoordinates && mapViewRef.current) {
        let point = await mapViewRef.current.getPointInView([
          centeredCoordinates.longitude,
          centeredCoordinates.latitude,
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
        const clickedTariffZone = tariffZones.find((f) => featureId === f.id);
        setHighlightedTariffZone(clickedTariffZone);
      }
    })();
  }, [centeredCoordinates, mapViewRef]);

  async function zoomIn() {
    const currentZoom = await mapViewRef.current?.getZoom();
    mapCameraRef.current?.zoomTo((currentZoom ?? 10) + 1, 200);
  }

  async function zoomOut() {
    const currentZoom = await mapViewRef.current?.getZoom();
    mapCameraRef.current?.zoomTo((currentZoom ?? 10) - 1, 200);
  }

  const flyToClickedPoint = (feature: Feature) => {
    if (feature && feature.geometry.type === 'Point') {
      mapCameraRef.current?.flyTo(feature.geometry.coordinates, 300);
    }
  };

  async function flyToCurrentLocation() {
    geolocation &&
      mapCameraRef.current?.flyTo(
        [geolocation?.coords.longitude, geolocation?.coords.latitude],
        750,
      );
  }

  const styles = useMapStyles();
  const controlStyles = useControlPositionsStyle();
  const {t, language} = useTranslation();

  const featureCollection = mapZonesToFeatureCollection(tariffZones, language);

  return (
    <View style={styles.container}>
      <View>
        <FullScreenHeader
          title={t(TariffZoneMapSelectionTexts.header.title)}
          leftButton={{
            onPress: () => navigation.goBack(),
            accessible: true,
            accessibilityRole: 'button',
            accessibilityLabel: t(
              TariffZoneMapSelectionTexts.header.leftButton.a11yLabel,
            ),
            icon: <ThemeIcon svg={ArrowLeft} />,
          }}
        />

        <Section withFullPadding>
          <ButtonInput
            onPress={onSelectZone}
            accessibilityHint={t(TariffZoneMapSelectionTexts.button.a11yHint)}
            accessibilityRole="button"
            accessibilityElementsHidden={!highlightedTariffZone}
            label={
              highlightedTariffZone
                ? t(
                    TariffZoneMapSelectionTexts.button.label.selected(
                      getNameInLanguage(highlightedTariffZone, language),
                    ),
                  )
                : t(TariffZoneMapSelectionTexts.button.label.noneSelected)
            }
            icon={<ThemeIcon svg={ArrowRight} />}
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
        onPress={flyToClickedPoint}
        {...MapViewConfig}
      >
        <MapboxGL.ShapeSource
          id={'tariffZonesShape'}
          shape={featureCollection}
          hitbox={{width: 1, height: 1}} // to not be able to hit multiple zones with one click
          buffer={20} // tweak to improve rendering speed
          tolerance={2} // tweak to improve rendering speed
        >
          <MapboxGL.FillLayer
            id="tariffZonesFill"
            style={{
              fillAntialias: true,
              fillColor: [
                // Mapbox Expression syntax
                'case',
                ['==', highlightedTariffZone?.id || '', ['id']],
                'blue',
                colors.primary.gray_300,
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
          <MapboxGL.SymbolLayer
            id="tariffZonesText"
            style={{
              textSize: 16,
              textField: [
                'concat',
                t(TariffZoneMapSelectionTexts.map.featureLabelPrefix),
                ['get', 'name'],
              ],
            }}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.Camera
          ref={mapCameraRef}
          zoomLevel={6}
          centerCoordinate={startCoordinates}
          {...MapCameraConfig}
        />
        <MapboxGL.UserLocation showsUserHeadingIndicator />
      </MapboxGL.MapView>

      <View style={controlStyles.controlsContainer}>
        <PositionArrow flyToCurrentLocation={flyToCurrentLocation} />
        <MapControls zoomIn={zoomIn} zoomOut={zoomOut} />
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
      name: getNameInLanguage(t, language),
    },
    geometry: t.geometry,
  })),
});

const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
  pinContainer: {
    position: 'absolute',
    top: '50%',
    right: '50%',
  },
  pin: {position: 'absolute', top: 40, right: -20, ...shadows},
}));

export default TariffZoneMapSelection;
