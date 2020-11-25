import {Location} from '@entur/sdk';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, Keyboard, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ProfileStackParams} from '..';
import SvgConfirm from '../../../assets/svg/icons/actions/Confirm';
import SvgDelete from '../../../assets/svg/icons/actions/Delete';
import {MapPointPin} from '../../../assets/svg/icons/places';
import Button, {ButtonGroup} from '../../../components/button';
import ThemeText from '../../../components/text';
import ThemeIcon from '../../../components/theme-icon';
import {useFavorites} from '../../../favorites/FavoritesContext';
import {LocationFavorite} from '../../../favorites/types';
import {useLocationSearchValue} from '../../../location-search';
import {RootStackParamList} from '../../../navigation';
import {StyleSheet, Theme} from '../../../theme';
import BackHeader from '../BackHeader';
import EmojiPopup from './EmojiPopup';

import * as Sections from '../../../components/sections';
import MessageBox from '../../../message-box';
import ScreenReaderAnnouncement from '../../../components/screen-reader-announcement';

type AddEditRouteName = 'AddEditFavorite';
const AddEditRouteNameStatic: AddEditRouteName = 'AddEditFavorite';

export type AddEditNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, AddEditRouteName>,
  StackNavigationProp<ProfileStackParams>
>;

type AddEditScreenRouteProp = RouteProp<RootStackParamList, AddEditRouteName>;

export type AddEditParams = {
  editItem?: LocationFavorite;
  searchLocation?: Location;
};

type AddEditProps = {
  navigation: AddEditNavigationProp;
  route: AddEditScreenRouteProp;
};

export default function AddEditFavorite({navigation, route}: AddEditProps) {
  const css = useScreenStyle();
  const {addFavorite, removeFavorite, updateFavorite} = useFavorites();
  const editItem = route?.params?.editItem;

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
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

  useEffect(() => setEmoji(editItem?.emoji), [editItem?.emoji]);

  useEffect(() => {
    if (errorMessage && location) {
      setErrorMessage(undefined);
    }
  }, [location]);

  // @TODO This must be fixed so that the emoji item it self is stored
  // in favorites, or some lookup to set selected item inside emoji panel.

  const save = async () => {
    if (!location) {
      setErrorMessage('Du må velge et sted du vil ha som favoritt');
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
    navigation.goBack();
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
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={css.container}>
      <BackHeader
        title={editItem ? 'Endre favorittsted' : 'Legg til favorittsted'}
        closeIcon
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
        <ScreenReaderAnnouncement message={errorMessage} />
        {errorMessage && (
          <MessageBox withMargin message={errorMessage} type="error" />
        )}

        <Sections.Section withPadding>
          <Sections.LocationInput
            label="Sted"
            location={location}
            placeholder="Søk etter adresse eller stoppested"
            onPress={() =>
              navigation.navigate('LocationSearch', {
                callerRouteName: AddEditRouteNameStatic,
                callerRouteParam: 'searchLocation',
                label: 'Sted',
                favoriteChipTypes: ['location', 'map'],
                initialLocation: location,
              })
            }
          />
        </Sections.Section>

        <Sections.Section withPadding>
          <Sections.TextInput
            label="Navn"
            onChangeText={setName}
            value={name}
            editable
            autoCapitalize="sentences"
            accessibilityHint="Navn for favoritten"
            placeholder="Legg til navn"
          />
        </Sections.Section>

        <Sections.Section withPadding>
          <Sections.ButtonInput
            onPress={openEmojiPopup}
            accessibilityElementsHidden={true}
            importantForAccessibility="no-hide-descendants"
            label="Ikon"
            icon="expand-more"
            type="inline"
            value={
              !emoji ? (
                <ThemeIcon svg={MapPointPin} />
              ) : (
                <ThemeText type="body">{emoji}</ThemeText>
              )
            }
          />
        </Sections.Section>
      </View>

      <ButtonGroup>
        <Button
          onPress={save}
          mode="primary"
          iconPosition="right"
          icon={SvgConfirm}
          text="Lagre favoritt"
        />

        {editItem && (
          <Button
            onPress={deleteItem}
            mode="destructive"
            iconPosition="right"
            icon={SvgDelete}
            text="Slett favorittsted"
          />
        )}
      </ButtonGroup>
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
    paddingTop: theme.spacings.medium,
  },
}));
