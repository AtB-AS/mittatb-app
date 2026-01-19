import {AxiosRequestHeaders} from 'axios';
import React, {useCallback, useEffect, useRef} from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {
  SelectionInlineSectionItem,
  TextInputSectionItem,
} from '@atb/components/sections';
import {StyleSheet} from '@atb/theme';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {storage} from '@atb/modules/storage';
import {AddHeaderOverride} from './AddHeaderOverride';

type DebugServerOverride = {
  match: RegExp;
  newValue: string;
  headers?: AxiosRequestHeaders;
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
  const [newHeaders, setNewHeaders] = React.useState<string>('');
  const focusRef = useRef(null);
  const {open} = useBottomSheetContext();
  const styles = useStyles();

  const addOverride = useCallback(
    (override: DebugServerOverride) => {
      const updatedOverrides = [...overrides, override];
      setOverrides(updatedOverrides);
      storage.set(
        '@ATB_debug_server_overrides',
        JSON.stringify(updatedOverrides),
      );
    },
    [overrides],
  );

  return (
    <View ref={focusRef} style={styles.overridesContainer}>
      {overrides.length ? (
        overrides.filter(onlyUniquesBasedOnField('match')).map((o) => (
          <SelectionInlineSectionItem
            key={o.match.toString()}
            label={o.match.toString()}
            value={o.newValue}
            onPressIcon={Delete}
            onPress={() => {
              setOverrides((prev) =>
                prev.filter(
                  (item) => item.match.toString() !== o.match.toString(),
                ),
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
  const [match, setMatch] = React.useState<string>('');
  const [newValue, setNewValue] = React.useState<string>('');
  const [headers, setHeaders] = React.useState<Map<string, string>>(new Map());
  const {close} = useBottomSheetContext();
  const styles = useStyles();

  function addExistingOverride(o: DebugServerOverride) {
    setMatch(o.match.source);
    setNewValue(o.newValue);
  }

  useEffect(() => {
    if (props.existingOverride) {
      addExistingOverride(props.existingOverride);
    } else {
      setHeaders((prev) => new Map(prev).set('Dummy key', 'Dummy value'));
    }
  }, [props.existingOverride]);

  return (
    <View style={styles.overrideInput}>
      <ThemeText typography="heading--medium">Add new override</ThemeText>
      <ThemeText typography="body__primary">
        Any request matching the regex will get its baseURL replaced by the New
        baseURL.
      </ThemeText>
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
      <View>
        <ThemeText typography="body__secondary">Headers (optional)</ThemeText>
        {[...headers.entries()].map(([key, value]) => (
          <AddHeaderOverride
            existingHeaderKey={key}
            existingHeaderValue={value}
            onSave={() => {}}
          />
        ))}
      </View>
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
      <Button
        text="Add Override"
        expanded={true}
        onPress={() => {
          props.onClose({match: new RegExp(match), newValue});
          close();
        }}
      />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  overridesContainer: {
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
