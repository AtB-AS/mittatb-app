import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {LoginNavigationProp} from './';
import * as Sections from '@atb/components/sections';
import Button from '@atb/components/button';
import {useAuthState} from '@atb/auth';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {ArrowRight} from '@atb/assets/svg/icons/navigation';

export type PhoneInputProps = {
  navigation: LoginNavigationProp;
};

export default function PhoneInput({navigation}: PhoneInputProps) {
  const {t} = useTranslation();
  const styles = useThemeStyles();
  const {signInWithPhoneNumber} = useAuthState();
  const [phoneNumber, setPhoneNumber] = useState('');

  const onNext = async () => {
    await signInWithPhoneNumber(phoneNumber);
    navigation.navigate('ConfirmCode');
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader title={'Logg Inn'} leftButton={{type: 'cancel'}} />

      <View style={styles.mainView}>
        <Sections.Section>
          <Sections.GenericItem>
            <ThemeText>Telefonnummer</ThemeText>
          </Sections.GenericItem>
          <Sections.TextInput
            label={'+ 47'}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            showClear={true}
          />
        </Sections.Section>
        <Button
          style={styles.button}
          color={'primary_2'}
          onPress={onNext}
          text={'Neste'}
          disabled={phoneNumber.length !== 8}
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
