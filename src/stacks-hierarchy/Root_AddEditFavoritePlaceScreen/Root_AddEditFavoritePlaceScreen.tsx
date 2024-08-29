import SvgConfirm from '@atb/assets/svg/mono-icons/actions/Confirm';
import SvgDelete from '@atb/assets/svg/mono-icons/actions/Delete';
import {Pin} from '@atb/assets/svg/mono-icons/map';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useFavorites} from '@atb/favorites';
import {useOnlySingleLocation} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {StyleSheet} from '@atb/theme';
import {AddEditFavoriteTexts, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {Alert, Keyboard, ScrollView, View} from 'react-native';
import {EmojiSheet} from './EmojiSheet';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {
  ButtonSectionItem,
  LocationInputSectionItem,
  Section,
  TextInputSectionItem,
} from '@atb/components/sections';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {StaticColorByType} from '@atb/theme/colors';

export type Props = RootStackScreenProps<'Root_AddEditFavoritePlaceScreen'>;

const themeColor: StaticColorByType<'background'> = 'background_3';

export const Root_AddEditFavoritePlaceScreen = ({navigation, route}: Props) => {
  const styles = useStyles();
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
  const location = useOnlySingleLocation<Props['route']>(
    'searchLocation',
    editItem?.location,
  );

  useEffect(() => setEmoji(editItem?.emoji), [editItem?.emoji]);

  useEffect(() => {
    if (errorMessage && location) {
      setErrorMessage(undefined);
    }
  }, [location, errorMessage]);

  // @TODO This must be fixed so that the emoji item it self is stored
  // in favorites, or some lookup to set selected item inside emoji panel.

  const save = async () => {
    if (!location || location.resultType === 'geolocation') {
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
    navigation.popToTop();
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
    openBottomSheet(() => (
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
      />
    ));
  };

  const openEmojiPopup = () => {
    Keyboard.dismiss();
    openEmojiSheet();
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={
          editItem
            ? t(AddEditFavoriteTexts.header.titleEdit)
            : t(AddEditFavoriteTexts.header.title)
        }
        leftButton={{type: !!editItem ? 'close' : 'back'}}
      />

      <ScrollView style={styles.innerContainer}>
        <ScreenReaderAnnouncement message={errorMessage} />
        {errorMessage && (
          <MessageInfoBox
            style={styles.errorMessageBox}
            message={errorMessage}
            type="error"
          />
        )}

        <Section style={styles.section}>
          <LocationInputSectionItem
            label={t(AddEditFavoriteTexts.fields.location.label)}
            location={location}
            onPress={() =>
              navigation.navigate('Root_LocationSearchByTextScreen', {
                callerRouteName: route.name,
                callerRouteParam: 'searchLocation',
                label: t(AddEditFavoriteTexts.fields.location.label),
                favoriteChipTypes: ['location', 'map'],
                initialLocation: location,
              })
            }
            testID="locationSearchButton"
          />
        </Section>

        <Section style={styles.section}>
          <TextInputSectionItem
            label={t(AddEditFavoriteTexts.fields.name.label)}
            onChangeText={setName}
            value={name}
            editable
            autoCapitalize="sentences"
            accessibilityHint={t(AddEditFavoriteTexts.fields.name.a11yHint)}
            placeholder={t(AddEditFavoriteTexts.fields.name.placeholder)}
            testID="nameInput"
          />
        </Section>

        <Section style={[styles.emojiContainer, styles.section]}>
          <ButtonSectionItem
            onPress={openEmojiPopup}
            accessibilityLabel={t(AddEditFavoriteTexts.fields.icon.a11yLabel)}
            accessibilityHint={t(AddEditFavoriteTexts.fields.icon.a11yHint)}
            label={t(AddEditFavoriteTexts.fields.icon.label)}
            icon="expand-more"
            value={
              !emoji ? (
                <ThemeIcon svg={Pin} />
              ) : (
                <ThemeText type="body__primary">{emoji}</ThemeText>
              )
            }
            testID="iconButton"
          />
        </Section>
        {emoji && (
          <Button
            text={t(AddEditFavoriteTexts.emojiSheet.rightButton)}
            type="small"
            mode="tertiary"
            backgroundColor={themeColor}
            onPress={() => {
              setEmoji(undefined);
            }}
          />
        )}
      </ScrollView>

      <FullScreenFooter avoidKeyboard={true}>
        <View style={styles.buttonContainer}>
          {editItem && (
            <Button
              onPress={deleteItem}
              interactiveColor="interactive_destructive"
              rightIcon={{svg: SvgDelete}}
              text={t(AddEditFavoriteTexts.delete.label)}
              testID="deleteButton"
            />
          )}

          <Button
            interactiveColor="interactive_0"
            onPress={save}
            rightIcon={{svg: SvgConfirm}}
            text={t(AddEditFavoriteTexts.save.label)}
            testID="saveButton"
          />
        </View>
      </FullScreenFooter>
    </View>
  );
};
const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
  buttonContainer: {
    marginBottom: theme.spacing.large,
    rowGap: theme.spacing.medium,
  },
  emojiContainer: {
    width: '50%',
  },
  section: {
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
  innerContainer: {
    flex: 1,
    paddingTop: theme.spacing.medium,
  },
  errorMessageBox: {
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
}));
