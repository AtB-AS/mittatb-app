import {deleteProfile} from '@atb/api/profile';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {useAuthContext} from '@atb/auth';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useFareContracts} from '@atb/ticketing';
import {useTranslation} from '@atb/translations';
import DeleteProfileTexts from '@atb/translations/screens/subscreens/DeleteProfile';
import React from 'react';
import {Alert, View} from 'react-native';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useTimeContext} from '@atb/time';
import {useBeaconsContext} from '@atb/beacons/BeaconsContext';
import {tGlobal} from '@atb/LocaleProvider.tsx';

export const Profile_DeleteProfileScreen = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {signOut, customerNumber} = useAuthContext();
  const {serverNow} = useTimeContext();
  const {fareContracts: availableFareContracts} = useFareContracts(
    {availability: 'available'},
    serverNow,
  );
  const hasAvailableFareContracts = availableFareContracts.length > 0;

  const {deleteCollectedData} = useBeaconsContext();

  const handleDeleteProfile = async () => {
    const isProfileDeleted = await deleteProfile();
    if (isProfileDeleted) {
      await deleteCollectedData();
      await signOut();
    } else {
      Alert.alert(
        tGlobal(DeleteProfileTexts.deleteError.title),
        tGlobal(DeleteProfileTexts.deleteError.message),
      );
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

  const {theme} = useThemeContext();
  const themeColor = theme.color.background.accent[0];

  return (
    <FullScreenView
      headerProps={{
        title: t(DeleteProfileTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <View
          style={{marginHorizontal: theme.spacing.medium}}
          accessible={true}
          ref={focusRef}
        >
          <ThemeText
            typography="heading--medium"
            color={themeColor}
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
        style={styles.contentMargin}
      />

      {hasAvailableFareContracts && (
        <MessageInfoBox
          message={t(DeleteProfileTexts.unableToDeleteWithFareContracts)}
          type="warning"
          style={{...styles.contentMargin, marginTop: 0}}
        />
      )}

      <Section style={styles.section}>
        <LinkSectionItem
          subtitle={`${customerNumber}`}
          text={t(DeleteProfileTexts.customerNumber)}
          accessibility={{
            accessibilityLabel: t(
              DeleteProfileTexts.buttonA11ytext(customerNumber?.toString()),
            ),
          }}
          onPress={() => showDeleteAlert()}
          disabled={hasAvailableFareContracts}
          icon={<ThemeIcon svg={Delete} color="error" />}
        />
      </Section>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.color.background.neutral[1].background,
    flex: 1,
  },
  contentMargin: {
    margin: theme.spacing.medium,
  },
  section: {
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
}));
