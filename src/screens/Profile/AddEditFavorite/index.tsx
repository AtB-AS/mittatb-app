/**
 * Implementation based on https://github.com/staltz/react-native-emoji-picker-staltz
 * Copyright (c) 2016 Yonah Forst
 * Modifications: Copyright (c) 2020 Andre 'Staltz' Medeiros
 * MIT
 */
import {RouteProp, CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState, useEffect, useRef} from 'react';
import {
  Alert,
  StyleProp,
  Text,
  View,
  ViewStyle,
  TextStyle,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {ProfileStackParams} from '..';
import {Close, Add, Remove, Confirm} from '../../../assets/svg/icons/actions/';
import {ArrowLeft, Expand} from '../../../assets/svg/icons/navigation/';
import {MapPointPin} from '../../../assets/svg/icons/places';
import {useFavorites} from '../../../favorites/FavoritesContext';
import {StyleSheet, Theme, useTheme} from '../../../theme';
import Button from '../../../components/button';
import EmojiPopup from './EmojiPopup';
import {Search} from '../../../assets/svg/icons/actions';
import {RootStackParamList} from '../../../navigation';
import {useLocationSearchValue} from '../../../location-search';
import ScreenHeader from '../../../ScreenHeader';
import {Modalize} from 'react-native-modalize';
import colors from '../../../theme/colors';
import Input from '../../../components/input';

type AddEditRouteName = 'AddEditFavorite';
const AddEditRouteNameStatic: AddEditRouteName = 'AddEditFavorite';

export type AddEditNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProfileStackParams, AddEditRouteName>,
  StackNavigationProp<RootStackParamList>
>;

type AddEditScreenRouteProp = RouteProp<ProfileStackParams, AddEditRouteName>;

type AddEditProps = {
  navigation: AddEditNavigationProp;
  route: AddEditScreenRouteProp;
};

export default function AddEditFavorite({navigation, route}: AddEditProps) {
  const css = useScreenStyle();
  const {addFavorite, removeFavorite, updateFavorite} = useFavorites();
  const editItem = route?.params?.editItem;

  const [emoji, setEmoji] = useState<string | undefined>(editItem?.emoji);
  const [name, setName] = useState<string>(editItem?.name ?? '');
  const location = useLocationSearchValue<AddEditScreenRouteProp>(
    'searchLocation',
    editItem?.location,
  );

  const emojiRef = useRef<Modalize>(null);
  const openEmojiPopup = () => {
    Keyboard.dismiss();
    emojiRef.current?.open();
  };

  const hasSelectedValues = Boolean(location);
  useEffect(() => setEmoji(editItem?.emoji), [editItem?.emoji]);

  // @TODO This must be fixed so that the emoji item it self is stored
  // in favorites, or some lookup to set selected item inside emoji panel.

  const save = async () => {
    if (!location) {
      return;
    }
    const newFavorite = {
      name: !name ? location?.name : name,
      location,
      emoji,
    };
    if (editItem) {
      // Update existing
      await updateFavorite({...newFavorite, id: editItem.id});
    } else {
      // Add new
      await addFavorite(newFavorite);
    }
    navigation.navigate('Profile');
  };
  const deleteItem = async () => {
    Alert.alert(
      'Slett favorittsted?',
      'Sikker på at du vil fjerne favorittstedet ditt?',
      [
        {
          text: 'Avbryt',
          style: 'cancel',
        },
        {
          text: 'Slett',
          style: 'destructive',
          onPress: async () => {
            if (!editItem) return;
            await removeFavorite(editItem.id);
            navigation.navigate('Profile');
          },
        },
      ],
    );
  };
  const cancel = () => navigation.goBack();

  return (
    <SafeAreaView style={css.container}>
      <ScreenHeader
        leftButton={{onPress: cancel, icon: <ArrowLeft />}}
        title="Legg til favorittsted"
      />
      <EmojiPopup
        localizedCategories={[
          'Smilefjes',
          'Personer',
          'Dyr og natur',
          'Mat og drikke',
          'Aktivitet',
          'Reise og steder',
          'Objekter',
          'Symboler',
        ]}
        ref={emojiRef}
        value={emoji ?? null}
        closeOnSelect={true}
        onEmojiSelected={(emoji) => {
          if (emoji == null) {
            setEmoji(undefined);
          } else {
            setEmoji(emoji);
          }
        }}
      />

      <View style={css.innerContainer}>
        <Input
          label="Sted"
          value={location?.label}
          placeholder="Søk etter adresse eller stoppested"
          onFocus={() =>
            navigation.navigate('LocationSearch', {
              callerRouteName: AddEditRouteNameStatic,
              callerRouteParam: 'searchLocation',
              label: 'Sted',
              hideFavorites: true,
              initialText: location?.name,
            })
          }
          autoCorrect={false}
          autoCompleteType="off"
        />

        <Input
          label="Navn"
          onChangeText={setName}
          value={name}
          editable
          autoCapitalize="sentences"
          accessibilityHint="Navn for favoritten"
          placeholder="Legg til navn"
        />

        <InputGroup title="Ikon" boxStyle={{width: 124}}>
          <SymbolPicker onPress={openEmojiPopup} value={emoji} />
        </InputGroup>

        <View style={css.line} />

        <Button
          onPress={save}
          IconComponent={editItem ? Confirm : Add}
          disabled={!hasSelectedValues}
          text="Lagre favorittsted"
        />

        {editItem && (
          <Button
            onPress={deleteItem}
            mode="destructive"
            IconComponent={RemoveIconWhite}
            text="Slett favorittsted"
          />
        )}

        <Button
          onPress={cancel}
          mode="secondary"
          IconComponent={Close}
          text="Avbryt"
        />
      </View>
    </SafeAreaView>
  );
}
const useScreenStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: theme.background.level3,
  },
  innerContainer: {
    flex: 1,
    padding: theme.sizes.pagePadding,
  },
  input: {
    backgroundColor: theme.background.level1,
    borderColor: colors.general.gray,
    color: theme.text.primary,
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 60,
    padding: 12,
    fontSize: 16,
  },
  line: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.general.gray,
  },
  lineNoMarginTop: {
    marginTop: 0,
  },
  emojiContainer: {},
  placeholder: {
    color: theme.text.faded,
  },
  inputContainer: {
    width: '100%',
    height: 46,
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 60,
    backgroundColor: theme.background.level1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.general.gray,
    color: theme.text.primary,
    zIndex: -1,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    alignSelf: 'center',
  },
}));

function RemoveIconWhite() {
  return <Remove fill="#ffffff" />;
}

type SymbolPickerProps = {
  onPress(): void;
  value?: string;
};
const SymbolPicker: React.FC<SymbolPickerProps> = ({onPress, value}) => {
  const css = useSymbolPickerStyle();
  return (
    <TouchableOpacity onPress={onPress} style={css.container}>
      <View style={css.emoji}>
        {!value ? (
          <MapPointPin style={css.emojiIcon} />
        ) : (
          <Text style={css.emojiText}>{value}</Text>
        )}
      </View>
      <Expand />
    </TouchableOpacity>
  );
};
const useSymbolPickerStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingVertical: 12,
    paddingLeft: 64,
    flexDirection: 'row',
    backgroundColor: theme.background.level1,
    borderWidth: 1,
    borderColor: colors.general.gray,
    borderRadius: 4,
  },
  emoji: {
    marginRight: 12,
  },
  emojiIcon: {
    paddingTop: 3,
    paddingBottom: 3,
  },
  emojiText: {
    fontSize: 16,
  },
}));

type InputGroupProps = {
  title: string;
  boxStyle?: StyleProp<ViewStyle>;
};
const InputGroup: React.FC<InputGroupProps> = ({title, boxStyle, children}) => {
  const css = useGroupStyle();

  return (
    <View style={[css.container, boxStyle]}>
      {children}
      <Text style={css.label}>{title}</Text>
    </View>
  );
};
const useGroupStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    marginBottom: 12,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    left: 12,
    fontSize: 14,
    lineHeight: 20,
  },
}));
