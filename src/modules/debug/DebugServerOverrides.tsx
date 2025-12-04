import {AxiosRequestHeaders} from 'axios';
import React, {useCallback, useRef} from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {storage} from '@atb/modules/storage';
import {Button} from '@atb/components/button';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {TextInputSectionItem} from '@atb/components/sections';

type DebugServerOverride = {
  match: RegExp;
  newValue: string;
  headers?: AxiosRequestHeaders;
};

export function DebugServerOverrides() {
  const [overrides, setOverrides] = React.useState<DebugServerOverride[]>([]);
  const [newHeaders, setNewHeaders] = React.useState<string>('');
  const focusRef = useRef(null);
  const {open} = useBottomSheetContext();

  useCallback(async () => {
    const fromStorage = await storage.get('@ATB_debug_server_overrides');
    const overrides = JSON.parse(fromStorage || '[]') as DebugServerOverride[];
    setOverrides(overrides);
  }, [])();

  const addOverride = useCallback((override: DebugServerOverride) => {
    console.log('Adding override', override);
    const updatedOverrides = [...overrides, override];
    setOverrides(updatedOverrides);
    /*storage.set(
      '@ATB_debug_server_overrides',
      JSON.stringify(updatedOverrides),
    );*/
  }, []);

  return (
    <View style={{gap: 12}} ref={focusRef}>
      {overrides.length ? (
        overrides.map((o) => (
          <ThemeText>
            {`${o.match}`} {o.newValue}
          </ThemeText>
        ))
      ) : (
        <ThemeText typography="body__primary--big">
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
                onClose={(override: DebugServerOverride) =>
                  addOverride(override)
                }
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
  const [newMatch, setNewMatch] = React.useState<string>('');
  const [newValue, setNewValue] = React.useState<string>('');
  const {close} = useBottomSheetContext();
  return (
    <View style={{paddingVertical: 50}}>
      <TextInputSectionItem
        label="Regex"
        placeholder=".*\/?bff\/.*"
        value={newMatch}
        onChangeText={setNewMatch}
      />
      <TextInputSectionItem
        label="New baseURL"
        placeholder="http://localhost:8080/"
        onChangeText={setNewValue}
        autoCapitalize="none"
      />
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
