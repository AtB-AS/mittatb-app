import SvgConfirm from '@atb/assets/svg/mono-icons/actions/Confirm';
import SvgDelete from '@atb/assets/svg/mono-icons/actions/Delete';
import {Pin} from '@atb/assets/svg/mono-icons/map';
import Button, {ButtonGroup} from '@atb/components/button';
import MessageBox from '@atb/components/message-box';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {useFavorites} from '@atb/favorites';
import {StoredLocationFavorite} from '@atb/favorites/types';
import {useOnlySingleLocation} from '@atb/location-search';
import {RootStackParamList} from '@atb/navigation';
import {StyleSheet, Theme} from '@atb/theme';
import {AddEditFavoriteTexts, useTranslation} from '@atb/translations';
import {Location} from '@entur/sdk';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {Alert, Keyboard, ScrollView, View} from 'react-native';
import {AddEditFavoriteRootParams} from '.';
import EmojiSheet from './EmojiSheet';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {useBottomSheet} from '@atb/components/bottom-sheet';

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
  const location = useOnlySingleLocation<AddEditScreenRouteProp>(
    'searchLocation',
    editItem?.location,
  );

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

  const {open: openBottomSheet} = useBottomSheet();

  const openEmojiSheet = () => {
    openBottomSheet((close) => (
      <EmojiSheet
        localizedCategories={[
          t(AddEditFavoriteTexts.emojiSheet.categories.smileys),
          t(AddEditFavoriteTexts.emojiSheet.categories.people),
          t(AddEditFavoriteTexts.emojiSheet.categories.animals),
          t(AddEditFavoriteTexts.emojiSheet.categories.food),
          t(AddEditFavoriteTexts.emojiSheet.categories.activities),
          t(AddEditFavoriteTexts.emojiSheet.categories.travel),
          t(AddEditFavoriteTexts.emojiSheet.categories.objects),
          t(AddEditFavoriteTexts.emojiSheet.categories.symbols),
        ]}
        value={emoji ?? null}
        closeOnSelect={true}
        onEmojiSelected={(emoji) => {
          if (emoji == null) {
            setEmoji(undefined);
          } else {
            setEmoji(emoji);
          }
        }}
        close={close}
      />
    ));
  };

  const openEmojiPopup = () => {
    Keyboard.dismiss();
    openEmojiSheet();
  };

  return (
    <View style={css.container}>
      <FullScreenHeader
        title={
          editItem
            ? t(AddEditFavoriteTexts.header.titleEdit)
            : t(AddEditFavoriteTexts.header.title)
        }
        leftButton={{type: !!editItem ? 'close' : 'back'}}
      />

      <ScrollView style={css.innerContainer}>
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
            testID="locationSearchButton"
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
            testID="nameInput"
          />
        </Sections.Section>

        <Sections.Section withPadding>
          <Sections.ButtonInput
            onPress={openEmojiPopup}
            accessibilityLabel={t(AddEditFavoriteTexts.fields.icon.a11yLabel)}
            accessibilityHint={t(AddEditFavoriteTexts.fields.icon.a11yHint)}
            label={t(AddEditFavoriteTexts.fields.icon.label)}
            icon="expand-more"
            type="inline"
            value={
              !emoji ? (
                <ThemeIcon svg={Pin} />
              ) : (
                <ThemeText type="body__primary">{emoji}</ThemeText>
              )
            }
            testID="iconButton"
          />
        </Sections.Section>
      </ScrollView>

      <FullScreenFooter avoidKeyboard={true}>
        <ButtonGroup>
          {editItem && (
            <Button
              onPress={deleteItem}
              mode="destructive"
              icon={SvgDelete}
              iconPosition="right"
              text={t(AddEditFavoriteTexts.delete.label)}
              testID="deleteButton"
            />
          )}
          <Button
            color="primary_2"
            onPress={save}
            icon={SvgConfirm}
            iconPosition="right"
            text={t(AddEditFavoriteTexts.save.label)}
            testID="saveButton"
          />
        </ButtonGroup>
      </FullScreenFooter>
    </View>
  );
}
const useScreenStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_3.backgroundColor,
  },
  innerContainer: {
    flex: 1,
    paddingTop: theme.spacings.medium,
  },
}));
