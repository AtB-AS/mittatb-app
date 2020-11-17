/**
 * Implementation based on https://github.com/staltz/react-native-emoji-picker-staltz
 * Copyright (c) 2016 Yonah Forst
 * Modifications: Copyright (c) 2020 Andre 'Staltz' Medeiros
 * MIT
 */
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Keyboard,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ProfileStackParams} from '..';
import {Add, Close, Confirm, Remove} from '../../../assets/svg/icons/actions/';
import {ArrowLeft, Expand} from '../../../assets/svg/icons/navigation/';
import {MapPointPin} from '../../../assets/svg/icons/places';
import Button from '../../../components/button';
import Input from '../../../components/input';
import {useFavorites} from '../../../favorites/FavoritesContext';
import {useLocationSearchValue} from '../../../location-search';
import {RootStackParamList} from '../../../navigation';
import ScreenHeader from '../../../ScreenHeader';
import {StyleSheet, Theme} from '../../../theme';
import EmojiPopup from './EmojiPopup';
import ThemeText from '../../../components/text';
import ThemeIcon from '../../../components/theme-icon';

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
    navigation.navigate('ProfileHome');
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
            navigation.navigate('ProfileHome');
          },
        },
      ],
    );
  };
  const cancel = () => navigation.goBack();

  return (
    <SafeAreaView style={css.container}>
      <ScreenHeader
        leftButton={{
          onPress: cancel,
          icon: <ThemeIcon svg={ArrowLeft} />,
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: 'Gå tilbake',
        }}
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
              favoriteChipTypes: ['location', 'map'],
              initialLocation: location,
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
          mode="primary"
          icon={editItem ? Confirm : Add}
          disabled={!hasSelectedValues}
          text="Lagre favorittsted"
        />

        {editItem && (
          <Button
            onPress={deleteItem}
            mode="destructive"
            icon={RemoveIconWhite}
            text="Slett favorittsted"
          />
        )}

        <Button onPress={cancel} mode="secondary" icon={Close} text="Avbryt" />
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
    padding: theme.spacings.medium,
  },
  input: {
    backgroundColor: theme.background.level1,
    borderColor: theme.border.primary,
    color: theme.text.colors.primary,
    borderWidth: theme.border.width.slim,
    borderRadius: theme.border.radius.small,
    paddingLeft: 60,
    padding: 12,
    fontSize: 16,
  },
  line: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.background.level1,
  },
  lineNoMarginTop: {
    marginTop: 0,
  },
  emojiContainer: {},
  placeholder: {
    color: theme.text.colors.faded,
  },
  inputContainer: {
    width: '100%',
    height: 46,
    flexDirection: 'row',
  },
  searchInput: {
    ...theme.text.body,
    flex: 1,
    paddingLeft: 60,
    backgroundColor: theme.background.level1,
    borderRadius: theme.border.radius.small,
    borderWidth: theme.border.width.slim,
    borderColor: theme.border.primary,
    color: theme.text.colors.primary,
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
          <ThemeIcon svg={MapPointPin} style={css.emojiIcon} />
        ) : (
          <ThemeText type="body">{value}</ThemeText>
        )}
      </View>
      <ThemeIcon svg={Expand} />
    </TouchableOpacity>
  );
};
const useSymbolPickerStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingVertical: theme.spacings.medium,
    paddingLeft: 64,
    flexDirection: 'row',
    backgroundColor: theme.background.level1,
    borderWidth: theme.border.width.slim,
    borderColor: theme.border.primary,
    borderRadius: theme.border.radius.small,
  },
  emoji: {
    marginRight: theme.spacings.medium,
  },
  emojiIcon: {
    paddingTop: 3,
    paddingBottom: 3,
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
      <ThemeText type="lead" style={css.label}>
        {title}
      </ThemeText>
    </View>
  );
};
const useGroupStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    marginBottom: theme.spacings.medium,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    left: theme.spacings.medium,
  },
}));
