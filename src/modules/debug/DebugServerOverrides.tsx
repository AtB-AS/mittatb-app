import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Platform, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet';
import {
  SectionSeparator,
  SelectionInlineSectionItem,
  TextInputSectionItem,
} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {onlyUniquesBasedOnPredicate} from '@atb/utils/only-uniques';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {storage} from '@atb/modules/storage';
import {HeaderOverride as HeaderOverrideComponent} from './HeaderOverride';
import {setDebugServerOverrides} from './debug-server-overrides-cache';
import Swipeable, {
  SwipeableMethods,
  SwipeDirection,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {ThemeIcon} from '@atb/components/theme-icon';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import type {DebugServerOverride, HeaderOverride} from './types';

type OftenUsedOverride = DebugServerOverride & {label: string};

// The Android emulator runs in a VM where "localhost" refers to the emulator
// itself, not the host machine. 10.0.2.2 is Android's special alias for the
// host loopback interface. iOS Simulator shares the host network stack, so
// "localhost" works directly.
const localBffHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

const oftenUsedOverrides: OftenUsedOverride[] = [
  {
    label: 'Local BFF',
    match: RegExp('/.*/bff\/?.*/'),
    newValue: `http://${localBffHost}:8080/`,
  },
  {
    label: 'Local BFF WebSocket',
    match: RegExp('/.*(ws|stream)\/?.*/'),
    newValue: `http://${localBffHost}:8080/`,
  },
];

export function DebugServerOverrides() {
  const [overrides, setOverrides] = React.useState<DebugServerOverride[]>([]);
  const focusRef = useRef<View>(null);
  const editBottomSheetRef = useRef<GorhomBottomSheetModal>(null);
  const addBottomSheetRef = useRef<GorhomBottomSheetModal>(null);
  const [selectedOverride, setSelectedOverride] = useState<
    DebugServerOverride | undefined
  >(undefined);
  const styles = useStyles();

  const addOverride = useCallback(
    (override: DebugServerOverride) => {
      const updatedOverrides = [...overrides, override];
      setOverrides(updatedOverrides);
      saveOverridesToStorage(updatedOverrides);
    },
    [overrides],
  );

  const updateOverride = useCallback(
    (updatedOverride: DebugServerOverride) => {
      const updatedOverrides = overrides.map((o) =>
        o.match.toString() === updatedOverride.match.toString()
          ? updatedOverride
          : o,
      );
      setOverrides(updatedOverrides);
      saveOverridesToStorage(updatedOverrides);
    },
    [overrides],
  );

  const deleteOverride = useCallback(
    (overrideToDelete: DebugServerOverride) => {
      Alert.alert(
        'Delete override',
        `Are you sure you want to delete the override for ${overrideToDelete.match.toString()}?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              const updatedOverrides = overrides.filter(
                (o) => o.match.toString() !== overrideToDelete.match.toString(),
              );
              setOverrides(updatedOverrides);
              saveOverridesToStorage(updatedOverrides);
            },
          },
        ],
      );
    },
    [overrides],
  );

  useEffect(() => {
    getOverridesFromStorage().then((storedOverrides) => {
      setOverrides(storedOverrides);
    });
  }, []);

  return (
    <View ref={focusRef} style={styles.container}>
      {overrides.length ? (
        overrides
          .filter(
            onlyUniquesBasedOnPredicate(
              (a, b) => a.match.source === b.match.source,
            ),
          )
          .map((o) => (
            <SwipeToDelete
              key={o.match.toString()}
              onDelete={() => deleteOverride(o)}
            >
              <SelectionInlineSectionItem
                label={o.match.toString()}
                value={o.newValue}
                onPress={() => {
                  setSelectedOverride(o);
                  editBottomSheetRef.current?.present();
                }}
              />
            </SwipeToDelete>
          ))
      ) : (
        <ThemeText typography="body__m__strong" style={{marginVertical: 16}}>
          No server overrides set
        </ThemeText>
      )}
      <Button
        text="Add server override"
        expanded={true}
        onPress={() => {
          setSelectedOverride(undefined);
          addBottomSheetRef.current?.present();
        }}
      />
      <BottomSheetModal
        bottomSheetModalRef={editBottomSheetRef}
        heading="Edit debug override"
        bottomSheetHeaderType={BottomSheetHeaderType.Close}
      >
        {selectedOverride && (
          <DebugServerInput
            existingOverride={selectedOverride}
            onClose={(override) => {
              updateOverride(override);
              editBottomSheetRef.current?.dismiss();
            }}
            onDelete={() => {
              editBottomSheetRef.current?.dismiss();
              deleteOverride(selectedOverride);
            }}
          />
        )}
      </BottomSheetModal>
      <BottomSheetModal
        bottomSheetModalRef={addBottomSheetRef}
        heading="Add debug override"
        bottomSheetHeaderType={BottomSheetHeaderType.Close}
      >
        <DebugServerInput
          onClose={(override: DebugServerOverride) => {
            if (
              overrides.some(
                (o) => o.match.toString() === override.match.toString(),
              )
            ) {
              return;
            }
            addOverride(override);
            addBottomSheetRef.current?.dismiss();
          }}
        />
      </BottomSheetModal>
    </View>
  );
}

const SWIPE_ACTION_WIDTH = 80;

function SwipeToDelete({
  children,
  onDelete,
}: React.PropsWithChildren<{onDelete: () => void}>) {
  const swipeableRef = useRef<SwipeableMethods | null>(null);

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (direction === 'left') {
        swipeableRef.current?.close();
        onDelete();
      }
    },
    [onDelete],
  );

  return (
    <Swipeable
      ref={swipeableRef}
      friction={1}
      overshootFriction={8}
      enableTrackpadTwoFingerGesture
      rightThreshold={20}
      renderRightActions={RightActionDelete}
      onSwipeableOpen={handleSwipe}
    >
      {children}
    </Swipeable>
  );
}

function RightActionDelete(
  _prog: SharedValue<number>,
  drag: SharedValue<number>,
) {
  const {theme} = useThemeContext();
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: drag.value + SWIPE_ACTION_WIDTH}],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: SWIPE_ACTION_WIDTH,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.color.status.error.primary.background,
        },
        styleAnimation,
      ]}
    >
      <ThemeIcon svg={Delete} size="large" />
    </Animated.View>
  );
}

function DebugServerInput(props: {
  existingOverride?: DebugServerOverride;
  onClose: (override: DebugServerOverride) => void;
  onDelete?: () => void;
}) {
  const [match, setMatch] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [headers, setHeaders] = useState<HeaderOverride[]>([]);
  const styles = useStyles();
  const {theme} = useThemeContext();

  function addExistingOverride(o: DebugServerOverride) {
    setMatch(o.match.source);
    setNewValue(o.newValue);
    setHeaders(o.headers ?? []);
  }

  useEffect(() => {
    if (props.existingOverride) {
      addExistingOverride(props.existingOverride);
    }
  }, [props.existingOverride]);

  return (
    <View style={styles.overrideInput}>
      <ThemeText typography="body__m">
        Any request matching the regex will get its baseURL replaced by the New
        baseURL.
      </ThemeText>
      <View style={styles.oftenUsedContainer}>
        <ThemeText typography="body__s">Often used</ThemeText>
        <View style={styles.oftenUsedOptions}>
          {oftenUsedOverrides.map((o) => (
            <Button
              key={o.label}
              type="small"
              expanded={false}
              onPress={() => {
                addExistingOverride(o);
              }}
              text={o.label}
            />
          ))}
        </View>
      </View>
      <SectionSeparator />
      <View>
        <ThemeText typography="body__s">New override</ThemeText>
        <TextInputSectionItem
          label="Regex"
          placeholder=".*"
          value={match}
          onChangeText={setMatch}
          autoCapitalize="none"
        />
        <TextInputSectionItem
          label="New baseURL"
          placeholder="http://your-url-here:7000"
          onChangeText={setNewValue}
          value={newValue}
          autoCapitalize="none"
        />
      </View>
      <View style={{gap: 12}}>
        <ThemeText typography="body__s">Headers (optional)</ThemeText>
        {headers.map((header, index) => (
          <HeaderOverrideComponent
            key={index}
            headerKey={header.key}
            headerValue={header.value}
            onKeyChange={(newKey) => {
              setHeaders((prev) =>
                prev.map((h, i) =>
                  i === index ? {key: newKey, value: h.value} : h,
                ),
              );
            }}
            onValueChange={(newValue) => {
              setHeaders((prev) =>
                prev.map((h, i) =>
                  i === index ? {key: h.key, value: newValue} : h,
                ),
              );
            }}
            onDelete={() => {
              setHeaders((prev) => prev.filter((_, i) => i !== index));
            }}
          />
        ))}
        <Button
          onPress={() => {
            setHeaders((prev) => {
              return [...prev, {key: '', value: ''}];
            });
          }}
          expanded={false}
          type="small"
          text="Add header"
          disabled={headers.some((h) => h.key === '')}
        />
      </View>
      <Button
        text="Save Override"
        expanded={true}
        onPress={() => {
          props.onClose({
            match: new RegExp(match),
            newValue,
            headers,
          });
        }}
      />
      {props.onDelete && (
        <Button
          text="Delete Override"
          expanded={true}
          interactiveColor={theme.color.interactive.destructive}
          onPress={props.onDelete}
        />
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    gap: theme.spacing.medium,
  },
  overrideInput: {
    paddingVertical: theme.spacing.large,
    paddingHorizontal: theme.spacing.medium,
    gap: theme.spacing.medium,
  },
  oftenUsedContainer: {
    gap: theme.spacing.small,
  },
  oftenUsedOptions: {
    gap: theme.spacing.small,
    flexDirection: 'row',
  },
}));

function saveOverridesToStorage(overrides: DebugServerOverride[]) {
  // Update in-memory cache immediately so requests use the new overrides
  setDebugServerOverrides(overrides);
  // Persist to storage in the background
  storage.set(
    '@ATB_debug_server_overrides',
    JSON.stringify(overrides.map((o) => ({...o, match: o.match.source}))),
  );
}

async function getOverridesFromStorage(): Promise<DebugServerOverride[]> {
  const overRidesFromStorage = await storage.get('@ATB_debug_server_overrides');
  if (overRidesFromStorage) {
    try {
      const parsed = JSON.parse(overRidesFromStorage);
      if (Array.isArray(parsed)) {
        return parsed.map((o) => ({
          ...o,
          match: new RegExp(o.match), // Recreate RegExp object from stored string
        }));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to parse debug server overrides from storage', e);
    }
  }
  return [];
}
