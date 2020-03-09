import React, {useState} from 'react';
import {View, Text, TouchableOpacityProperties} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {StyleSheet, Theme, useTheme} from '../../../theme';
import LocationInput from '../../Onboarding/LocationInput';
import {Location} from '../../../favorites/types';
import {useGeolocationState} from '../../../GeolocationContext';
import SaveDisketteIcon from '../../../assets/svg/SaveDisketteIcon';
import CancelCrossIcon from '../../../assets/svg/CancelCrossIcon';
import {ProfileStackParams} from '..';
import {StackNavigationProp} from '@react-navigation/stack';
import {useFavorites} from '../../../favorites/FavoritesContext';

type AddFavoriteScreenNavigationProp = StackNavigationProp<
  ProfileStackParams,
  'Profile'
>;

type ScreenProps = {
  navigation: AddFavoriteScreenNavigationProp;
};

export default function AddEditFavorite({navigation}: ScreenProps) {
  const css = useScreenStyle();
  const {addFavorite} = useFavorites();

  const {theme} = useTheme();

  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<Location | undefined>();

  const save = async () => {
    if (!location) {
      return;
    }
    await addFavorite({
      name,
      location,
    });
    navigation.goBack();
  };
  const cancel = () => navigation.goBack();

  return (
    <View style={css.container}>
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
        Lagre favorittsted
      </Button>

      <Button onPress={cancel} secondary IconComponent={CancelCrossIcon}>
        Avbryt
      </Button>
    </View>
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
  secondary?: boolean;
  IconComponent?: React.ElementType;
} & TouchableOpacityProperties;
const Button: React.FC<ButtonProps> = ({
  onPress,
  secondary = false,
  IconComponent,
  children,
  ...props
}) => {
  const css = useButtonStyle();
  return (
    <TouchableOpacity onPress={onPress} {...props}>
      <View style={[css.button, secondary ? css.buttonSecondary : undefined]}>
        {IconComponent && <IconComponent />}
        <View style={css.textContainer}>
          <Text style={css.text}>{children}</Text>
        </View>
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
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.border.primary,
  },
  textContainer: {
    flex: 1,
    marginEnd: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
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
