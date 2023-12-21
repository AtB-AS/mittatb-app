import {deleteProfile} from '@atb/api/profile';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {useAuthState} from '@atb/auth';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import {useTranslation} from '@atb/translations';
import DeleteProfileTexts from '@atb/translations/screens/subscreens/DeleteProfile';
import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {ProfileScreenProps} from './navigation-types';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useTimeContextState} from '@atb/time';
import {useBeaconsState} from '@atb/beacons/BeaconsContext';

type DeleteProfileScreenProps =
  ProfileScreenProps<'Profile_DeleteProfileScreen'>;

export const Profile_DeleteProfileScreen = ({
  navigation,
}: DeleteProfileScreenProps) => {
  const style = useStyle();
  const {t} = useTranslation();
  const {signOut, customerNumber} = useAuthState();
  const {fareContracts} = useTicketingState();
  const {serverNow} = useTimeContextState();
  const activeFareContracts =
    filterActiveOrCanBeUsedFareContracts(fareContracts, serverNow).length > 0;

  const [deleteError, setDeleteError] = useState<boolean>(false);

  const {deleteCollectedData} = useBeaconsState();

  const handleDeleteProfile = async () => {
    try {
      const delete_ok = await deleteProfile();
      if (delete_ok) {
        await deleteCollectedData();
        await signOut();
        navigation.navigate('Profile_RootScreen');
      } else {
        setDeleteError(true);
      }
    } catch (error) {
      console.error('An error occurred during profile deletion:', error);
      setDeleteError(true);
    }
  };

  const showDeleteAlert = async () => {
    Alert.alert(
      t(DeleteProfileTexts.deleteConfirmation.title),
      t(DeleteProfileTexts.deleteConfirmation.message),
      [
        {
          text: t(DeleteProfileTexts.deleteConfirmation.cancel),
          style: 'cancel',
        },
        {
          text: t(DeleteProfileTexts.deleteConfirmation.confirm),
          style: 'destructive',
          onPress: handleDeleteProfile,
        },
      ],
    );
  };

  useEffect(() => {
    if (deleteError) {
      Alert.alert(
        t(DeleteProfileTexts.deleteError.title),
        t(DeleteProfileTexts.deleteError.message),
      );
    }
    setDeleteError(false);
  }, [deleteError, setDeleteError, t]);
  const {theme} = useTheme();

  return (
    <FullScreenView
      headerProps={{
        title: t(DeleteProfileTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <View
          style={{marginHorizontal: theme.spacings.medium}}
          accessible={true}
          ref={focusRef}
        >
          <ThemeText
            type="heading--medium"
            color="background_accent_0"
            style={{flexShrink: 1}}
          >
            {t(DeleteProfileTexts.header.title)}
          </ThemeText>
        </View>
      )}
    >
      <MessageInfoBox
        message={t(DeleteProfileTexts.deleteInfo)}
        type="info"
        style={style.contentMargin}
      />

      {activeFareContracts && (
        <MessageInfoBox
          message={t(DeleteProfileTexts.unableToDeleteWithFareContracts)}
          type="warning"
          style={{...style.contentMargin, marginTop: 0}}
        />
      )}

      <Section withPadding>
        <LinkSectionItem
          subtitle={`${customerNumber}`}
          text={t(DeleteProfileTexts.customerNumber)}
          accessibility={{
            accessibilityLabel: t(
              DeleteProfileTexts.buttonA11ytext(customerNumber?.toString()),
            ),
          }}
          onPress={() => showDeleteAlert()}
          disabled={activeFareContracts}
          icon={<ThemeIcon svg={Delete} colorType="error" />}
        />
      </Section>
    </FullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  contentMargin: {
    margin: theme.spacings.medium,
  },
}));
