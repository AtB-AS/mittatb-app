import {AxiosRequestHeaders} from 'axios';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {storage} from '@atb/modules/storage';
import {Button} from '@atb/components/button';

type ServerOverride = {
  match: RegExp;
  newValue: string;
  headers: AxiosRequestHeaders;
};

export function DebugServerOverrides() {
  const [overrides, setOverrides] = React.useState<ServerOverride[]>([]);
  const [newMatch, setNewMatch] = React.useState<string>('');
  const [newValue, setNewValue] = React.useState<string>('');
  const [newHeaders, setNewHeaders] = React.useState<string>('');

  useCallback(async () => {
    const fromStorage = await storage.get('@ATB_debug_server_overrides');
    const overrides = JSON.parse(fromStorage || '[]') as ServerOverride[];
    setOverrides(overrides);
  }, [])();

  function onAddOverride() {}

  return (
    <View style={{gap: 12}}>
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
      <Button text="Add server override" expanded={true} onPress={() => {}} />
    </View>
  );
}
