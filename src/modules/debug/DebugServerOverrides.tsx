import {AxiosRequestHeaders} from 'axios';
import React, {useCallback, useRef} from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {storage} from '@atb/modules/storage';
import {Button} from '@atb/components/button';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {TextInputSectionItem} from '@atb/components/sections';

type ServerOverride = {
  match: RegExp;
  newValue: string;
  headers: AxiosRequestHeaders;
};

export function DebugServerOverrides() {
  const [overrides, setOverrides] = React.useState<ServerOverride[]>([]);
  const [newHeaders, setNewHeaders] = React.useState<string>('');
  const focusRef = useRef(null);
  const {open} = useBottomSheetContext();

  useCallback(async () => {
    const fromStorage = await storage.get('@ATB_debug_server_overrides');
    const overrides = JSON.parse(fromStorage || '[]') as ServerOverride[];
    setOverrides(overrides);
  }, [])();

  function onAddOverride() {}

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
          open(DebugServerInput, focusRef);
        }}
      />
    </View>
  );
}

function DebugServerInput(
  onClose: (match: string, newBaseUrl: string) => void,
) {
  const [newMatch, setNewMatch] = React.useState<string>('');
  const [newValue, setNewValue] = React.useState<string>('');
  const {close} = useBottomSheetContext();
  return (
    <View style={{paddingVertical: 50}}>
      <TextInputSectionItem label="Match" placeholder=".*\/?bff\/.*" value={} />
      <TextInputSectionItem
        label="New baseURL"
        placeholder="http://localhost:8080/"
        onBlur={(val) => setNewValue(val)}
      />
      <Button
        text="Add Override"
        expanded={true}
        onPress={() => {
          onClose(newMatch, newValue);
          close();
        }}
      />
    </View>
  );
}
