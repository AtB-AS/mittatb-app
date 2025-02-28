import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {storage} from '@atb/storage';
import {StyleSheet} from '@atb/theme';
import {useEffect, useState} from 'react';
import {TextInput, View} from 'react-native';

export const DebugTokenServerAddress = () => {
  const [ipAddress, setIpAddress] = useState<string>('');

  const saveDebugIpAddress = async (ipAddress: string) => {
    if (ipAddress.length > 0) {
      const fullAddress = `http://${ipAddress}:8080`;
      await storage.set('@ATB_debug_token_server_ip_address', fullAddress);
    } else {
      await storage.remove('@ATB_debug_token_server_ip_address');
    }
  };

  useEffect(() => {
    const getStoredIpAddress = async () => {
      const storedAddress = await storage.get(
        '@ATB_debug_token_server_ip_address',
      );
      setIpAddress(storedAddress ?? '');
    };
    getStoredIpAddress();
  }, []);

  return (
    <View>
      <ThemeText>Server IP Address</ThemeText>

      <TextInput
        onChangeText={(text) => setIpAddress(text)}
        value={ipAddress}
        inputMode="numeric"
        placeholder="e.g. 10.100.1.89 (Leave blank to use default)"
        clearButtonMode="always"
      />
      <Button
        onPress={async () => await saveDebugIpAddress(ipAddress)}
        text="Use IP Address"
        style={styles.button}
        expanded={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
  },
  container: {
    marginVertical: 8,
  },
});
