import {RouteProp, CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleProp,
  Text,
  View,
  ViewStyle,
  TextStyle,
  SafeAreaView,
} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {ProfileStackParams} from '..';
import CancelCrossIcon from '../../../assets/svg/CancelCrossIcon';
import ChevronDownIcon from '../../../assets/svg/ChevronDownIcon';
import DeleteTrashCanIcon from '../../../assets/svg/DeleteTrashCanIcon';
import MapPointIcon from '../../../assets/svg/MapPointIcon';
import SaveDisketteIcon from '../../../assets/svg/SaveDisketteIcon';
import {useFavorites} from '../../../favorites/FavoritesContext';
import {StyleSheet, Theme, useTheme} from '../../../theme';
import Button from '../../../components/button';
import EmojiPopup from './EmojiPopup';
import {RenderedEmoji} from './Emojis';
import InputSearchIcon from '../../../location-search/svg/InputSearchIcon';
import {SharedElement} from 'react-navigation-shared-element';
import {RootStackParamList} from '../../../navigation';
import {useLocationSearchValue} from '../../../location-search';
import ScreenHeader from '../../../ScreenHeader';
import ChevronLeftIcon from '../../../assets/svg/ChevronLeftIcon';

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
  const {theme} = useTheme();
  const editItem = route?.params?.editItem;

  const [isEmojiVisible, setEmojiVisible] = useState<boolean>(false);
  const [emoji, setEmoji] = useState<RenderedEmoji | undefined>(undefined);
  const [name, setName] = useState<string>(editItem?.name ?? '');
  const location = useLocationSearchValue<AddEditScreenRouteProp>(
    'searchLocation',
    editItem?.location,
  );

  const hasSelectedValues = Boolean(location);

  // @TODO This must be fixed so that the emoji item it self is stored
  // in favorites, or some lookup to set selected item inside emoji panel.
  const renderedEmoji = emoji?.renderedText ?? editItem?.emoji ?? '';

  const save = async () => {
    if (!location) {
      return;
    }
    const newFavorite = {
      name: !name ? location?.name : name,
      location,
      emoji: renderedEmoji,
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
        leftButton={{onPress: cancel, icon: <ChevronLeftIcon />}}
        title="Legg til favorittsted"
      />
      <EmojiPopup
        onClose={() => setEmojiVisible(false)}
        open={isEmojiVisible}
        value={emoji}
        onEmojiSelected={(emoji: RenderedEmoji) => {
          setEmoji(emoji);
          setEmojiVisible(false);
        }}
      />

      <View style={css.innerContainer}>
        <InputGroup title="Adresse eller stoppested">
          <SharedElement id="locationSearchInput">
            <View style={css.inputContainer}>
              <TextInput
                style={css.searchInput}
                value={location?.label}
                placeholder="Søk etter adresse eller stoppested"
                onFocus={() =>
                  navigation.navigate('LocationSearch', {
                    callerRouteName: AddEditRouteNameStatic,
                    callerRouteParam: 'searchLocation',
                    hideFavorites: true,
                    initialText: location?.name,
                  })
                }
                autoCorrect={false}
                autoCompleteType="off"
                placeholderTextColor={(css.placeholder as TextStyle).color}
              />
              <InputSearchIcon style={css.searchIcon} />
            </View>
          </SharedElement>
        </InputGroup>

        <InputGroup title="Navn">
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

        <InputGroup
          title="Symbol"
          boxStyle={{marginBottom: 0, alignItems: 'flex-start'}}
        >
          <SymbolPicker
            onPress={() => setEmojiVisible(true)}
            value={renderedEmoji}
          />
        </InputGroup>

        <View style={css.line} />

        <Button
          onPress={save}
          IconComponent={SaveDisketteIcon}
          disabled={!hasSelectedValues}
          text="Lagre favorittsted"
        />

        {editItem && (
          <Button
            onPress={deleteItem}
            mode="destructive"
            IconComponent={DeleteTrashCanIcon}
            text="Slett favorittsted"
          />
        )}

        <Button
          onPress={cancel}
          mode="secondary"
          IconComponent={CancelCrossIcon}
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
  },
  innerContainer: {
    flex: 1,
    padding: theme.sizes.pagePadding,
  },
  input: {
    backgroundColor: theme.background.level1,
    borderBottomColor: theme.border.primary,
    color: theme.text.primary,
    borderBottomWidth: 2,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  line: {
    marginVertical: 36,
    borderBottomWidth: 1,
    borderBottomColor: theme.border.primary,
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
    paddingLeft: 44,
    backgroundColor: theme.background.level1,
    borderBottomWidth: 2,
    borderRadius: 4,
    borderBottomColor: theme.border.primary,
    color: theme.text.primary,
    zIndex: -1,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    alignSelf: 'center',
  },
}));

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
          <MapPointIcon style={css.emojiIcon} />
        ) : (
          <Text style={css.emojiText}>{value}</Text>
        )}
      </View>
      <ChevronDownIcon />
    </TouchableOpacity>
  );
};
const useSymbolPickerStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: 12,
    flexDirection: 'row',
    backgroundColor: theme.background.level2,
    alignSelf: 'flex-start',
    borderRadius: 4,
  },
  emoji: {
    marginLeft: 5,
    marginRight: 5,
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
