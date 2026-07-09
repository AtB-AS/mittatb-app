import {FareZoneResultType, type FareZoneWithMetadata} from './types';
import {FareZoneResults} from './FareZoneResults';
import {View} from 'react-native';
import {Button} from '@atb/components/button';
import {FareZonesTexts, useTranslation} from '@atb/translations';
import MapboxGL, {UserLocationRenderMode} from '@rnmapbox/maps';

import {
  flyToLocation,
  hitboxCoveringIconOnly,
  MapCameraConfig,
  NationalStopRegistryFeatures,
  LocationArrow,
  useMapViewConfig,
  TariffZoneLinesAndLabels,
  mapZonesToPolygonCollection,
} from '@atb/modules/map';
import hexToRgba from 'hex-to-rgba';
import React, {useRef} from 'react';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {useAccessibilityContext} from '@atb/modules/accessibility';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {OnPressEvent} from '@rnmapbox/maps/src/types/OnPressEvent';
import {useInitialCoordinates} from '@atb/utils/use-initial-coordinates';
import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
  useSelectableFareZones,
} from '@atb/modules/purchase-selection';
import {Loading} from '@atb/components/loading';

type Props = {
  selection: PurchaseSelectionType;
  selectNext: 'from' | 'to';
  isApplicableOnSingleZoneOnly: boolean;
  onSelect: (selection: PurchaseSelectionType) => void;
  onSave?: () => void;
};

const FareZonesSelectorMap = ({
  selection,
  selectNext,
  isApplicableOnSingleZoneOnly,
  onSelect,
  onSave,
}: Props) => {
  const fareZones = useSelectableFareZones(selection.preassignedFareProduct);
  const styles = useMapStyles();
  const selectionBuilder = usePurchaseSelectionBuilder();

  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[0];
  const a11yContext = useAccessibilityContext();

  const {location} = useGeolocationContext();
  const initialCoordinates = useInitialCoordinates();

  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);

  const selectFeature = (event: OnPressEvent) => {
    const feature = event.features[0];
    flyToLocation({coordinates: event.coordinates, mapCameraRef, mapViewRef});
    updateSelectedZones(feature.id as string);
  };

  const featureCollection = mapZonesToPolygonCollection(fareZones, language);

  const {bottom: safeAreaBottom} = useSafeAreaInsets();

  const updateSelectedZones = (
    fareZoneId: string,
    resultType: FareZoneResultType = 'zone',
  ) => {
    const clickedFareZone = fareZones.find(
      (fareZone) => fareZoneId === fareZone.id,
    )!;
    const zone: FareZoneWithMetadata = {
      ...clickedFareZone,
      resultType: resultType,
    };
    const builder = selectionBuilder.fromSelection(selection);
    if (selectNext === 'from') builder.fromZone(zone);
    if (selectNext === 'to' || isApplicableOnSingleZoneOnly)
      builder.toZone(zone);
    const {selection: newSelection} = builder.build();
    onSelect(newSelection);
  };

  const mapViewConfig = useMapViewConfig();

  return (
    <>
      {a11yContext.isScreenReaderEnabled ? (
        <>
          <FareZoneResults
            fareZones={fareZones}
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
                text={t(FareZonesTexts.saveButton.text)}
                accessibilityHint={t(FareZonesTexts.saveButton.a11yHint)}
                testID="saveZonesButton"
              />
            </View>
          )}
        </>
      ) : !initialCoordinates ? (
        <View style={styles.waitingForInitialCoords}>
          <Loading size="large" />
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
            <NationalStopRegistryFeatures
              selectedFeaturePropertyId={undefined}
              onMapItemClick={undefined}
            />

            <MapboxGL.ShapeSource
              id="tariffZonesFillShape"
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
                    ['==', selection.zones?.from.id ?? '', ['id']],
                    hexToRgba(theme.color.zone.from.background, 0.6),
                    ['==', selection.zones?.to.id ?? '', ['id']],
                    !isApplicableOnSingleZoneOnly
                      ? hexToRgba(theme.color.zone.to.background, 0.6)
                      : 'transparent',
                    'transparent',
                  ],
                  fillEmissiveStrength: 1,
                }}
              />
            </MapboxGL.ShapeSource>
            <TariffZoneLinesAndLabels
              polygonCollection={featureCollection}
              showLabelsAtAllZoom
            />
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
                  <LocationArrow
                    onPress={() =>
                      flyToLocation({
                        coordinates: location?.coordinates,
                        mapCameraRef,
                        mapViewRef,
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
                  text={t(FareZonesTexts.saveButton.text)}
                  accessibilityHint={t(FareZonesTexts.saveButton.a11yHint)}
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

export {FareZonesSelectorMap};

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
