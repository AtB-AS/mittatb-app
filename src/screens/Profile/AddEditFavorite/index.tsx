import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {StyleSheet, Theme, useTheme} from '../../../theme';
import LocationInput from '../../Onboarding/LocationInput';
import {Location} from '../../../favorites/types';
import {useGeolocationState} from '../../../GeolocationContext';
import SaveDisketteIcon from '../../../assets/svg/SaveDisketteIcon';
import CancelCrossIcon from '../../../assets/svg/CancelCrossIcon';
import {ProfileStackParams} from '..';
import {StackNavigationProp} from '@react-navigation/stack';

type AddFavoriteScreenNavigationProp = StackNavigationProp<
  ProfileStackParams,
  'Profile'
>;

type ScreenProps = {
  navigation: AddFavoriteScreenNavigationProp;
};

export default function AddEditFavorite({navigation}: ScreenProps) {
  const css = useScreenStyle();
  const {theme} = useTheme();

  const [name, setName] = useState<string>('');
  const [_, setLocation] = useState<Location | undefined>();

  const save = () => {
    console.log('Saving');
    navigation.goBack();
  };
  const cancel = () => navigation.goBack();

  return (
    <ScrollView style={css.container}>
      <InputGroup title="Name">
        <TextInput
          style={css.input}
          onChangeText={setName}
          value={name}
          editable
          autoCapitalize="sentences"
          accessibilityHint="Navn for favoritten"
          placeholder="Legg til navn"
          placeholderTextColor={theme.text.faded}
        />
      </InputGroup>

      <LocationInputGroup onChange={setLocation} />

      <View style={[css.line, css.lineNoMarginTop]} />

      <Button onPress={save} IconComponent={SaveDisketteIcon}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          Save
        </Text>
      </Button>

      <Button onPress={cancel} cancel IconComponent={CancelCrossIcon}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          Avbryt
        </Text>
      </Button>
    </ScrollView>
  );
}
const useScreenStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    padding: theme.sizes.pagePadding,
  },
  input: {
    backgroundColor: theme.background.primary,
    borderBottomColor: theme.border.primary,
    color: theme.text.primary,
    borderBottomWidth: 2,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  line: {
    marginVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.border.primary,
  },
  lineNoMarginTop: {
    marginTop: 0,
  },
}));

type ButtonProps = {
  onPress(): void;
  cancel?: boolean;
  IconComponent?: React.ElementType;
};
const Button: React.FC<ButtonProps> = ({
  onPress,
  cancel = false,
  IconComponent,
  children,
}) => {
  const css = useButtonStyle();
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[css.button, cancel ? css.buttonCancel : undefined]}>
        {IconComponent && <IconComponent />}
        <View style={css.text}>{children}</View>
      </View>
    </TouchableOpacity>
  );
};
const useButtonStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  button: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
    borderTopLeftRadius: 16,
    backgroundColor: theme.background.accent,
    marginBottom: 24,
  },
  buttonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.border.primary,
  },
  text: {
    flex: 1,
    marginStart: 10,
    marginEnd: 10,
    alignItems: 'center',
  },
}));

type InputGroupProps = {
  title: string;
};
const InputGroup: React.FC<InputGroupProps> = ({title, children}) => {
  const css = useGroupStyle();

  return (
    <View style={css.container}>
      <Text style={css.label}>{title}</Text>
      {children}
    </View>
  );
};
const useGroupStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
}));

type LocationInputGroupProps = {
  onChange(location: Location): void;
};
const LocationInputGroup: React.FC<LocationInputGroupProps> = ({onChange}) => {
  const {location} = useGeolocationState();
  const [address, setAddress] = useState<string>('');
  const onSelected = (location: Location) => {
    setAddress(location.name);
    onChange(location);
  };

  return (
    <InputGroup title="Adresse eller stoppested">
      <LocationInput
        location={location}
        placeholder="Skriv inn adresse eller stoppested"
        text={address}
        onChangeText={setAddress}
        onSelectLocation={onSelected}
        testID="profileLocation"
      />
    </InputGroup>
  );
};
