import {StyleSheet, Theme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {Alert, Platform, View} from 'react-native';
import MessageBox from '@atb/components/message-box';
import * as Sections from '@atb/components/sections';
import ThemeIcon from '@atb/components/theme-icon';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketState,
} from '@atb/tickets';
import deleteProfile from '@atb/api/delete_profile';
import {useAuthState} from '@atb/auth';
import {StackNavigationProp} from '@react-navigation/stack';
import {CompositeNavigationProp} from '@react-navigation/native';
import {ProfileStackParams} from '..';
import {RootStackParamList} from '@atb/navigation';
import DeleteProfileTexts from '@atb/translations/screens/subscreens/DeleteProfile';

export type DeleteProfileNavigationProp = StackNavigationProp<
  ProfileStackParams,
  'DeleteProfile'
>;

type DeleteProfilecreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList>,
  DeleteProfileNavigationProp
>;

type DeleteProfileScreenProps = {
  navigation: DeleteProfilecreenNavigationProp;
};

export default function DeleteProfile({navigation}: DeleteProfileScreenProps) {
  const style = useStyle();
  const {t} = useTranslation();
  const {signOut, customerNumber} = useAuthState();
  const {fareContracts} = useTicketState();
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
          containerStyle={style.contentMargin}
        />

        {activeFareContracts && (
          <MessageBox
            message={t(DeleteProfileTexts.unableToDeleteWithTickets)}
            type="warning"
            containerStyle={{...style.contentMargin, marginTop: 0}}
          />
        )}

        <Sections.Section withPadding>
          <Sections.LinkItem
            subtitle={`${customerNumber}`}
            text={t(DeleteProfileTexts.customerNumber)}
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
