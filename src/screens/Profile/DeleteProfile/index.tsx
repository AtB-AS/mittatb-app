import deleteProfile from '@atb/api/delete_profile';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {useAuthState} from '@atb/auth';
import {MessageBox} from '@atb/components/message-box';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet, Theme} from '@atb/theme';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import {useTranslation} from '@atb/translations';
import DeleteProfileTexts from '@atb/translations/screens/subscreens/DeleteProfile';
import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ProfileScreenProps} from '../types';

type DeleteProfileScreenProps = ProfileScreenProps<'DeleteProfile'>;

export default function DeleteProfile({navigation}: DeleteProfileScreenProps) {
  const style = useStyle();
  const {t} = useTranslation();
  const {signOut, customerNumber} = useAuthState();
  const {fareContracts} = useTicketingState();
  const activeFareContracts =
    filterActiveOrCanBeUsedFareContracts(fareContracts).length > 0;

  const [deleteError, setDeleteError] = useState<boolean>(false);

  const doDeleteProfile = async () => {
    await Alert.alert(
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
          onPress: async () => {
            const delete_ok = await deleteProfile();
            if (delete_ok) {
              signOut().then(() => {
                navigation.navigate('ProfileHome');
              });
            } else {
              setDeleteError(true);
            }
          },
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
  }, [deleteError, setDeleteError]);

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(DeleteProfileTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView>
        <MessageBox
          message={t(DeleteProfileTexts.deleteInfo)}
          type={'info'}
          style={style.contentMargin}
        />

        {activeFareContracts && (
          <MessageBox
            message={t(DeleteProfileTexts.unableToDeleteWithFareContracts)}
            type="warning"
            style={{...style.contentMargin, marginTop: 0}}
          />
        )}

        <Sections.Section withPadding>
          <Sections.LinkItem
            subtitle={`${customerNumber}`}
            text={t(DeleteProfileTexts.customerNumber)}
            accessibility={{
              accessibilityLabel: t(
                DeleteProfileTexts.buttonA11ytext(customerNumber?.toString()),
              ),
            }}
            onPress={() => doDeleteProfile()}
            disabled={activeFareContracts}
            icon={<ThemeIcon svg={Delete} colorType="error" />}
          />
        </Sections.Section>
      </ScrollView>
    </View>
  );
}

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  contentMargin: {
    margin: theme.spacings.medium,
  },
}));
