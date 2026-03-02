import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {
  SectionSeparator,
  SelectionInlineSectionItem,
  TextInputSectionItem,
} from '@atb/components/sections';
import {StyleSheet} from '@atb/theme';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {storage} from '@atb/modules/storage';
import {HeaderOverride} from './HeaderOverride';

type HeaderOverride = {
  key: string;
  value: string;
};

type DebugServerOverride = {
  match: RegExp;
  newValue: string;
  headers?: HeaderOverride[];
};

type OftenUsedOverride = DebugServerOverride & {label: string};

const oftenUsedOverrides: OftenUsedOverride[] = [
  {
    label: 'Local BFF',
    match: RegExp('/.*/bff\/?.*/'),
    newValue: 'http://localhost:8080/',
  },
];

export function DebugServerOverrides() {
  const [overrides, setOverrides] = React.useState<DebugServerOverride[]>([]);
  const focusRef = useRef(null);
  const {open} = useBottomSheetContext();
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
      console.log('Updated overrides: ', updatedOverrides);
      setOverrides(updatedOverrides);
      saveOverridesToStorage(updatedOverrides);
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
        overrides.filter(onlyUniquesBasedOnField('match')).map((o) => (
          <SelectionInlineSectionItem
            key={o.match.toString()}
            label={o.match.toString()}
            value={o.newValue}
            onPressIcon={Delete}
            onPress={() => {
              open(
                () => (
                  <DebugServerInput
                    existingOverride={o}
                    onClose={updateOverride}
                  />
                ),
                focusRef,
              );
            }}
          />
        ))
      ) : (
        <ThemeText
          typography="body__primary--bold"
          style={{marginVertical: 16}}
        >
          No server overrides set
        </ThemeText>
      )}
      <Button
        text="Add server override"
        expanded={true}
        onPress={() => {
          open(
            () => (
              <DebugServerInput
                onClose={(override: DebugServerOverride) => {
                  if (
                    overrides.some(
                      (o) => o.match.toString() === override.match.toString(),
                    )
                  ) {
                    console.warn(
                      'Tried to add duplicate override. Doing nothing.',
                    );
                    return;
                  }
                  addOverride(override);
                }}
              />
            ),
            focusRef,
          );
        }}
      />
    </View>
  );
}

function DebugServerInput(props: {
  existingOverride?: DebugServerOverride;
  onClose: (override: DebugServerOverride) => void;
}) {
  const [match, setMatch] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [headers, setHeaders] = useState<HeaderOverride[]>([]);
  const {close} = useBottomSheetContext();
  const styles = useStyles();

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
      <ThemeText typography="heading--medium">Add debug override</ThemeText>
      <ThemeText typography="body__primary">
        Any request matching the regex will get its baseURL replaced by the New
        baseURL.
      </ThemeText>
      <View style={styles.oftenUsedContainer}>
        <ThemeText typography="body__secondary">Often used</ThemeText>
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
        <ThemeText typography="body__secondary">New override</ThemeText>
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
        <ThemeText typography="body__secondary">Headers (optional)</ThemeText>
        {headers.map((header) => (
          <HeaderOverride
            key={header.key}
            headerKey={header.key}
            headerValue={header.value}
            onChange={(newKey, newValue) => {
              console.log('Updated header: ', {newKey, newValue});
              setHeaders((prev) => {
                return prev.map((h) => {
                  if (h.key === header.key) {
                    return {key: newKey, value: newValue};
                  }
                  return h;
                });
              });
            }}
            onDelete={(keyToDelete) => {
              setHeaders((prev) => prev.filter((h) => h.key !== keyToDelete));
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
          close();
        }}
      />
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
  storage.set(
    '@ATB_debug_server_overrides',
    JSON.stringify(overrides.map((o) => ({...o, match: o.match.source}))), // RegExp objects can't be directly stringified, so we store the source string and recreate the RegExp when loading
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
      console.warn('Failed to parse debug server overrides from storage', e);
    }
  }
  return [];
}
