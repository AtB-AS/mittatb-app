import SvgConfirm from '@atb/assets/svg/icons/actions/Confirm';
import SvgDelete from '@atb/assets/svg/icons/actions/Delete';
import {MapPointPin} from '@atb/assets/svg/icons/places';
import Button, {ButtonGroup} from '@atb/components/button';
import ScreenHeader from '@atb/components/screen-header';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {useFavorites} from '@atb/favorites';
import {StoredLocationFavorite} from '@atb/favorites/types';
import {useLocationSearchValue} from '@atb/location-search';
import MessageBox from '@atb/message-box';
import {RootStackParamList} from '@atb/navigation';
import {StyleSheet, Theme} from '@atb/theme';
import {AddEditFavoriteTexts, useTranslation} from '@atb/translations';
import {Location} from '@entur/sdk';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, Keyboard, KeyboardAvoidingView, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AddEditFavoriteRootParams} from '.';
import EmojiPopup from './EmojiPopup';

type AddEditRouteName = 'AddEditForm';
const AddEditRouteNameStatic: AddEditRouteName = 'AddEditForm';

export type AddEditParams = {
  editItem?: StoredLocationFavorite;
  searchLocation?: Location;
};

export type AddEditNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AddEditFavoriteRootParams, AddEditRouteName>,
  StackNavigationProp<RootStackParamList>
>;

type AddEditScreenRouteProp = RouteProp<
  AddEditFavoriteRootParams,
  AddEditRouteName
>;

type AddEditProps = {
  navigation: AddEditNavigationProp;
  route: AddEditScreenRouteProp;
};

export default function AddEditFavorite({navigation, route}: AddEditProps) {
  const css = useScreenStyle();
  const {
    addFavoriteLocation: addFavorite,
    removeFavoriteLocation: removeFavorite,
    updateFavoriteLocation: updateFavorite,
  } = useFavorites();
  const editItem = route?.params?.editItem;
  const {t} = useTranslation();

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
      setErrorMessage(t(AddEditFavoriteTexts.save.notSelectedFromError));
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

    Keyboard.dismiss();
    if (!editItem) {
      navigation.popToTop();
    }
    navigation.goBack();
  };
  const deleteItem = async () => {
    Alert.alert(
      t(AddEditFavoriteTexts.delete.label),
      t(AddEditFavoriteTexts.delete.confirmWarning),
      [
        {
          text: t(AddEditFavoriteTexts.cancel.label),
          style: 'cancel',
        },
        {
          text: t(AddEditFavoriteTexts.delete.label),
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
      <ScreenHeader
        title={
          editItem
            ? t(AddEditFavoriteTexts.header.titleEdit)
            : t(AddEditFavoriteTexts.header.title)
        }
        leftButton={{type: !!editItem ? 'close' : 'back'}}
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
            label={t(AddEditFavoriteTexts.fields.location.label)}
            location={location}
            onPress={() =>
              navigation.navigate('LocationSearch', {
                callerRouteName: AddEditRouteNameStatic,
                callerRouteParam: 'searchLocation',
                label: t(AddEditFavoriteTexts.fields.location.label),
                favoriteChipTypes: ['location', 'map'],
                initialLocation: location,
              })
            }
          />
        </Sections.Section>

        <Sections.Section withPadding>
          <Sections.TextInput
            label={t(AddEditFavoriteTexts.fields.name.label)}
            onChangeText={setName}
            value={name}
            editable
            autoCapitalize="sentences"
            accessibilityHint={t(AddEditFavoriteTexts.fields.name.a11yHint)}
            placeholder={t(AddEditFavoriteTexts.fields.name.placeholder)}
          />
        </Sections.Section>

        <Sections.Section withPadding>
          <Sections.ButtonInput
            onPress={openEmojiPopup}
            accessibilityElementsHidden={true}
            importantForAccessibility="no-hide-descendants"
            label={t(AddEditFavoriteTexts.fields.icon.label)}
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

      <KeyboardAvoidingView behavior="padding">
        <ButtonGroup>
          <Button
            onPress={save}
            color="primary"
            icon={SvgConfirm}
            iconPosition="right"
            text={t(AddEditFavoriteTexts.save.label)}
          />

          {editItem && (
            <Button
              onPress={deleteItem}
              color="destructive"
              icon={SvgDelete}
              iconPosition="right"
              text={t(AddEditFavoriteTexts.delete.label)}
            />
          )}
        </ButtonGroup>
      </KeyboardAvoidingView>
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
