import {
  TariffZoneResultType,
  TariffZoneSelection,
} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import TariffZoneResults from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByTextScreen/TariffZoneResults';
import {View} from 'react-native';
import {Button} from '@atb/components/button';
import {Language, TariffZonesTexts, useTranslation} from '@atb/translations';
import MapboxGL, {OnPressEvent} from '@rnmapbox/maps';
import {
  flyToLocation,
  MapCameraConfig,
  MapControls,
  MapViewConfig,
  PositionArrow,
  zoomIn,
  zoomOut,
} from '@atb/components/map';
import hexToRgba from 'hex-to-rgba';
import React, {useRef} from 'react';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {StyleSheet, useTheme} from '@atb/theme';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {TariffZone} from '@atb/reference-data/types';
import {FeatureCollection, Polygon} from 'geojson';
import {getReferenceDataName} from '@atb/reference-data/utils';
import turfCentroid from '@turf/centroid';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  selectedZones: TariffZoneSelection;
  isApplicableOnSingleZoneOnly: boolean;
  setSelectedZones: (selectedZones: TariffZoneSelection) => void;
  onSave?: () => void;
};

const TariffZonesSelectorMap = ({
  selectedZones,
  isApplicableOnSingleZoneOnly,
  setSelectedZones,
  onSave,
}: Props) => {
  const {tariffZones} = useFirestoreConfiguration();
  const styles = useMapStyles();
  const {location: geolocation} = useGeolocationState();
  const {t, language} = useTranslation();
  const {theme} = useTheme();
  const a11yContext = useAccessibilityContext();

  const selectFeature = (event: OnPressEvent) => {
    const feature = event.features[0];
    flyToLocation(event.coordinates, mapCameraRef);
    updateSelectedZones(feature.id as string);
  };

  const startCoordinates = geolocation
    ? [geolocation.coordinates.longitude, geolocation.coordinates.latitude]
    : [FOCUS_ORIGIN.longitude, FOCUS_ORIGIN.latitude];

  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);

  const featureCollection = mapZonesToFeatureCollection(tariffZones, language);

  const {bottom: safeAreaBottom} = useSafeAreaInsets();

  async function flyToCurrentLocation() {
    flyToLocation(geolocation?.coordinates, mapCameraRef);

    if (mapViewRef.current && geolocation) {
      let point = await mapViewRef.current.getPointInView([
        geolocation.coordinates.longitude,
        geolocation.coordinates.latitude,
      ]);
      const featuresAtPoint =
        await mapViewRef.current.queryRenderedFeaturesAtPoint(
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

  const updateSelectedZones = (
    tariffZoneId: string,
    resultType: TariffZoneResultType = 'zone',
  ) => {
    const clickedTariffZone = tariffZones.find(
      (tariffZone) => tariffZoneId === tariffZone.id,
    )!;
    const newZoneSelection: TariffZoneSelection = {
      ...selectedZones,
      [selectedZones.selectNext]: {
        ...clickedTariffZone,
        resultType: resultType,
      },
      selectNext: isApplicableOnSingleZoneOnly
        ? 'from'
        : selectedZones.selectNext === 'from'
        ? 'to'
        : 'from',
    };
    setSelectedZones(newZoneSelection);
  };

  return (
    <>
      {a11yContext.isScreenReaderEnabled ? (
        <>
          <TariffZoneResults
            tariffZones={tariffZones}
            onSelect={(t) => updateSelectedZones(t.id)}
          />

          {onSave && (
            <View
              style={[
                styles.saveButton,
                {
                  paddingBottom: Math.max(
                    safeAreaBottom,
                    theme.spacings.medium,
                  ),
                },
              ]}
            >
              <Button
                onPress={onSave}
                interactiveColor="interactive_0"
                text={t(TariffZonesTexts.saveButton.text)}
                accessibilityHint={t(TariffZonesTexts.saveButton.a11yHint)}
                testID="saveZonesButton"
              />
            </View>
          )}
        </>
      ) : (
        <>
          <MapboxGL.MapView
            ref={mapViewRef}
            style={{
              flex: 1,
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
                    hexToRgba(theme.static.zone_selection.from.background, 0.6),
                    ['==', selectedZones.to.id, ['id']],
                    !isApplicableOnSingleZoneOnly
                      ? hexToRgba(
                          theme.static.zone_selection.to.background,
                          0.6,
                        )
                      : 'transparent',
                    'transparent',
                  ],
                }}
              />
              <MapboxGL.LineLayer
                id="tariffZonesLine"
                style={{
                  lineWidth: 1,
                  lineColor: '#666666',
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
                    textHaloWidth: 2,
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
                <PositionArrow onPress={flyToCurrentLocation} />
                <MapControls
                  zoomIn={() => zoomIn(mapViewRef, mapCameraRef)}
                  zoomOut={() => zoomOut(mapViewRef, mapCameraRef)}
                />
              </View>
            </View>

            {onSave && (
              <View style={styles.saveButton}>
                <Button
                  onPress={onSave}
                  interactiveColor="interactive_0"
                  text={t(TariffZonesTexts.saveButton.text)}
                  accessibilityHint={t(TariffZonesTexts.saveButton.a11yHint)}
                  testID="saveZonesButton"
                />
              </View>
            )}
          </View>
        </>
      )}
    </>
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

export {TariffZonesSelectorMap};

const useMapStyles = StyleSheet.createThemeHook((theme) => ({
  saveButton: {
    marginHorizontal: theme.spacings.medium,
  },
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
}));
