import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {LoginNavigationProp} from './';
import * as Sections from '@atb/components/sections';
import Button from '@atb/components/button';
import {useAuthState} from '@atb/auth';

export type ConfirmCodeProps = {
  navigation: LoginNavigationProp;
};

export default function ConfirmCode({navigation}: ConfirmCodeProps) {
  const {t} = useTranslation();
  const styles = useThemeStyles();
  const {confirmCode} = useAuthState();
  const [code, setCode] = useState('');

  const onLogin = async () => {
    await confirmCode(code);
    navigation.navigate('ProfileHome');
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader title={'Logg inn'} leftButton={{type: 'back'}} />

      <View style={styles.mainView}>
        <Sections.Section>
          <Sections.TextInput
            label={'Kode'}
            placeholder="Bekreftelseskode fra SMS"
            onChangeText={setCode}
          />
        </Sections.Section>
        <Button
          style={styles.button}
          color={'primary_2'}
          onPress={onLogin}
          text={'Logg inn'}
          disabled={!code}
        />
      </View>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.background.level1,
    flex: 1,
  },
  mainView: {
    margin: theme.spacings.medium,
  },
  button: {
    marginTop: theme.spacings.medium,
  },
}));
