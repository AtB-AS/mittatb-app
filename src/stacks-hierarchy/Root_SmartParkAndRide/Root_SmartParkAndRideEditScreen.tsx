import {Confirm, Delete} from '@atb/assets/svg/mono-icons/actions';
import {Button} from '@atb/components/button';
import {FullScreenView} from '@atb/components/screen-view';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import {useState} from 'react';
import {Alert, View} from 'react-native';
import {RootStackScreenProps} from '..';
import {ScreenHeading} from '@atb/components/heading';
import {
  useEditVehicleRegistrationMutation,
  useDeleteVehicleRegistrationMutation,
  LicensePlateSection,
} from '@atb/modules/smart-park-and-ride';
import {MessageInfoBox} from '@atb/components/message-info-box';

type Props = RootStackScreenProps<'Root_SmartParkAndRideEditScreen'>;

export const Root_SmartParkAndRideEditScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const [nickname, setNickname] = useState(
    params.vehicleRegistration.nickname || '',
  );
  const [licensePlate, setLicensePlate] = useState(
    params.vehicleRegistration.licensePlate,
  );
  const {theme} = useThemeContext();

  const onSuccess = () => navigation.goBack();

  const {
    mutate: editVehicleRegistrationMutate,
    isError: editVehicleRegistrationIsError,
  } = useEditVehicleRegistrationMutation(
    params.vehicleRegistration.id,
    licensePlate,
    nickname,
    onSuccess,
  );

  const {
    mutate: deleteVehicleRegistrationMutate,
    isError: deleteVehicleRegistrationIsError,
  } = useDeleteVehicleRegistrationMutation(
    params.vehicleRegistration.id,
    onSuccess,
  );

  const showDeleteConfirmation = () => {
    Alert.alert(
      t(SmartParkAndRideTexts.edit.delete.confirmation.title),
      t(SmartParkAndRideTexts.edit.delete.confirmation.message),
      [
        {
          text: t(SmartParkAndRideTexts.edit.delete.confirmation.cancel),
          style: 'cancel',
        },
        {
          text: t(SmartParkAndRideTexts.edit.delete.confirmation.confirm),
          style: 'destructive',
          onPress: () => deleteVehicleRegistrationMutate(),
        },
      ],
    );
  };

  return (
    <FullScreenView
      headerProps={{
        title: t(SmartParkAndRideTexts.edit.header.title),
        leftButton: {type: 'back', withIcon: true},
        color: theme.color.background.neutral[1],
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(SmartParkAndRideTexts.edit.header.title)}
        />
      )}
      footer={
        <View style={styles.footer}>
          <Button
            expanded={true}
            onPress={() => editVehicleRegistrationMutate()}
            text={t(SmartParkAndRideTexts.edit.button)}
            rightIcon={{svg: Confirm}}
            mode="primary"
          />
          <Button
            expanded={true}
            onPress={showDeleteConfirmation}
            text={t(SmartParkAndRideTexts.edit.delete.button)}
            rightIcon={{svg: Delete}}
            mode="secondary"
            backgroundColor={theme.color.background.neutral[1]}
          />
        </View>
      }
    >
      <View style={styles.container}>
        <Section>
          <TextInputSectionItem
            label={t(SmartParkAndRideTexts.edit.inputs.nickname.label)}
            placeholder={t(
              SmartParkAndRideTexts.edit.inputs.nickname.placeholder,
            )}
            onChangeText={setNickname}
            value={nickname}
            inlineLabel={false}
            maxLength={20}
          />
        </Section>

        <LicensePlateSection
          inputProps={{
            value: licensePlate,
            onChangeText: setLicensePlate,
          }}
        />

        {editVehicleRegistrationIsError && (
          <MessageInfoBox
            type="error"
            message={t(SmartParkAndRideTexts.edit.error)}
          />
        )}
        {deleteVehicleRegistrationIsError && (
          <MessageInfoBox
            type="error"
            message={t(SmartParkAndRideTexts.edit.delete.error)}
          />
        )}
      </View>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacing.medium,
    gap: theme.spacing.medium,
  },
  footer: {
    paddingTop: theme.spacing.medium,
    display: 'flex',
    gap: theme.spacing.medium,
  },
}));
