import {AxiosRequestHeaders} from 'axios';
import React, {useCallback, useRef} from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {
  SelectionInlineSectionItem,
  TextInputSectionItem,
} from '@atb/components/sections';
import {useThemeContext} from '@atb/theme';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {storage} from '@atb/modules/storage';

type DebugServerOverride = {
  match: RegExp;
  newValue: string;
  headers?: AxiosRequestHeaders;
};

export function DebugServerOverrides() {
  const [overrides, setOverrides] = React.useState<DebugServerOverride[]>([]);
  const [newHeaders, setNewHeaders] = React.useState<string>('');
  const {theme} = useThemeContext();
  const focusRef = useRef(null);
  const {open} = useBottomSheetContext();

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
    <View ref={focusRef} style={{gap: theme.spacing.medium}}>
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
  onClose: (override: DebugServerOverride) => void;
}) {
  const {theme} = useThemeContext();
  const [newMatch, setNewMatch] = React.useState<string>('');
  const [newValue, setNewValue] = React.useState<string>('');
  const {close} = useBottomSheetContext();
  return (
    <View
      style={{
        paddingVertical: theme.spacing.large,
        paddingHorizontal: theme.spacing.medium,
        gap: theme.spacing.medium,
      }}
    >
      <ThemeText typography="heading--medium">Add new override</ThemeText>
      <ThemeText typography="body__primary">
        Any request matching the regex will get its baseURL replaced by the New
        baseURL.
      </ThemeText>
      <ThemeText typography="body__secondary">
        Useful for rerouting some requests to i.e. local version of BFF
      </ThemeText>
      <TextInputSectionItem
        label="Regex"
        placeholder=".*"
        value={newMatch}
        onChangeText={setNewMatch}
        autoCapitalize="none"
      />
      <TextInputSectionItem
        label="New baseURL"
        placeholder="http://your-url-here:7000"
        onChangeText={setNewValue}
        value={newValue}
        autoCapitalize="none"
      />
      <View style={{gap: theme.spacing.small}}>
        <ThemeText typography="body__secondary">Often used</ThemeText>
        <Button
          type="small"
          expanded={false}
          onPress={() => {
            setNewMatch('.*\/bff\/?.*');
            setNewValue('http://localhost:8080/');
          }}
          text="Local BFF"
        />
      </View>
      <Button
        text="Add Override"
        expanded={true}
        onPress={() => {
          props.onClose({match: new RegExp(newMatch), newValue});
          close();
        }}
      />
    </View>
  );
}
