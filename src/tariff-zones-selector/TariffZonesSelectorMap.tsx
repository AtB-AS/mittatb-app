import {TariffZoneResultType, type TariffZoneWithMetadata} from './types';
import {TariffZoneResults} from './TariffZoneResults';
import {ActivityIndicator, View} from 'react-native';
import {Button} from '@atb/components/button';
import {Language, TariffZonesTexts, useTranslation} from '@atb/translations';
import MapboxGL, {UserLocationRenderMode} from '@rnmapbox/maps';

import {
  flyToLocation,
  hitboxCoveringIconOnly,
  MapCameraConfig,
  NationalStopRegistryFeatures,
  PositionArrow,
  useMapViewConfig,
} from '@atb/components/map';
import hexToRgba from 'hex-to-rgba';
import React, {useRef} from 'react';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useGeolocationContext} from '@atb/GeolocationContext';
import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {getReferenceDataName, TariffZone} from '@atb/modules/configuration';
import {FeatureCollection, Polygon} from 'geojson';
import turfCentroid from '@turf/centroid';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {useInitialCoordinates} from '@atb/utils/use-initial-coordinates';
import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
  useSelectableTariffZones,
} from '@atb/modules/purchase-selection';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

type Props = {
  selection: PurchaseSelectionType;
  selectNext: 'from' | 'to';
  isApplicableOnSingleZoneOnly: boolean;
  onSelect: (selection: PurchaseSelectionType) => void;
  onSave?: () => void;
};

const TariffZonesSelectorMap = ({
  selection,
  selectNext,
  isApplicableOnSingleZoneOnly,
  onSelect,
  onSave,
}: Props) => {
  const tariffZones = useSelectableTariffZones(
    selection.preassignedFareProduct,
  );
  const styles = useMapStyles();
  const selectionBuilder = usePurchaseSelectionBuilder();

  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[0];
  const a11yContext = useAccessibilityContext();

  const {location} = useGeolocationContext();
  const initialCoordinates = useInitialCoordinates();

  const selectFeature = (event: OnPressEvent) => {
    const feature = event.features[0];
    flyToLocation({coordinates: event.coordinates, mapCameraRef});
    updateSelectedZones(feature.id as string);
  };

  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);

  const featureCollection = mapZonesToFeatureCollection(tariffZones, language);

  const {bottom: safeAreaBottom} = useSafeAreaInsets();

  const updateSelectedZones = (
    tariffZoneId: string,
    resultType: TariffZoneResultType = 'zone',
  ) => {
    const clickedTariffZone = tariffZones.find(
      (tariffZone) => tariffZoneId === tariffZone.id,
    )!;
    const zone: TariffZoneWithMetadata = {
      ...clickedTariffZone,
      resultType: resultType,
    };
    const builder = selectionBuilder.fromSelection(selection);
    if (selectNext === 'from') builder.fromZone(zone);
    if (selectNext === 'to' || isApplicableOnSingleZoneOnly)
      builder.toZone(zone);
    const newSelection = builder.build();
    onSelect(newSelection);
  };

  const mapViewConfig = useMapViewConfig();
  const {isMapV2Enabled} = useFeatureTogglesContext();

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
                  paddingBottom: Math.max(safeAreaBottom, theme.spacing.medium),
                },
              ]}
            >
              <Button
                expanded={true}
                onPress={onSave}
                interactiveColor={interactiveColor}
                text={t(TariffZonesTexts.saveButton.text)}
                accessibilityHint={t(TariffZonesTexts.saveButton.a11yHint)}
                testID="saveZonesButton"
              />
            </View>
          )}
        </>
      ) : !initialCoordinates ? (
        <View style={styles.waitingForInitialCoords}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <MapboxGL.MapView
            ref={mapViewRef}
            style={{
              flex: 1,
            }}
            {...mapViewConfig}
          >
            {isMapV2Enabled && (
              <NationalStopRegistryFeatures
                selectedFeaturePropertyId={undefined}
                onMapItemClick={undefined}
              />
            )}
            <MapboxGL.ShapeSource
              id="tariffZonesShape"
              shape={featureCollection}
              hitbox={hitboxCoveringIconOnly} // to not be able to hit multiple zones with one click
              onPress={selectFeature}
            >
              <MapboxGL.FillLayer
                id="tariffZonesFill"
                style={{
                  fillAntialias: true,
                  fillColor: [
                    // Mapbox Expression syntax
                    'case',
                    ['==', selection.zones?.from.id, ['id']],
                    hexToRgba(theme.color.zone.from.background, 0.6),
                    ['==', selection.zones?.to.id, ['id']],
                    !isApplicableOnSingleZoneOnly
                      ? hexToRgba(theme.color.zone.to.background, 0.6)
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
                key={String(f.id)}
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
              centerCoordinate={[
                initialCoordinates.longitude,
                initialCoordinates.latitude,
              ]}
              {...MapCameraConfig}
            />
            <MapboxGL.UserLocation renderMode={UserLocationRenderMode.Native} />
          </MapboxGL.MapView>

          <View style={[styles.bottomControls, {bottom: safeAreaBottom}]}>
            {location && (
              <View>
                <View style={styles.mapControls}>
                  <PositionArrow
                    onPress={() =>
                      flyToLocation({
                        coordinates: location?.coordinates,
                        mapCameraRef,
                      })
                    }
                  />
                </View>
              </View>
            )}

            {onSave && (
              <View style={styles.saveButton}>
                <Button
                  expanded={true}
                  onPress={onSave}
                  interactiveColor={interactiveColor}
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
    marginHorizontal: theme.spacing.medium,
  },
  bottomControls: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'flex-end',
  },
  mapControls: {
    position: 'absolute',
    bottom: theme.spacing.medium,
    right: theme.spacing.medium,
  },
  waitingForInitialCoords: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.color.background.neutral[1].background,
  },
}));
